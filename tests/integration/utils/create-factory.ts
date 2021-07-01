import { buildPrismaInclude } from './build-prisma-include';
import { getPrismaClient } from './get-prisma-client';

interface CreateFactoryOptions<CreateInputType> {
  beforeCreate?: (attrs: CreateInputType) => typeof attrs;
}

export function createFactory<CreateInputType>(
  modelName: string,
  defaultAttrs = {},
  options: CreateFactoryOptions<CreateInputType> = {}
) {
  const prisma = getPrismaClient();

  const FactoryFunctions = {
    build: (attrs: Partial<CreateInputType> = {}) => {
      return {
        ...defaultAttrs,
        ...attrs
      } as CreateInputType;
    },

    create: async (attrs: Partial<CreateInputType> = {}) => {
      let data = FactoryFunctions.build(attrs);

      const prismaOptions: Record<string, any> = {};
      const includes = buildPrismaInclude(attrs);

      if (includes) {
        prismaOptions.include = includes;
      }

      if (options.beforeCreate) {
        data = options.beforeCreate(data);
      }

      const prismaModel = modelName.toLowerCase();

      const result = await prisma[prismaModel].create({
        data,
        ...prismaOptions
      });

      return result;
    }
  };

  return FactoryFunctions;
}
