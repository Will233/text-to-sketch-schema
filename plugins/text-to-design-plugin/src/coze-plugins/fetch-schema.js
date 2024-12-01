import { Args } from '@/runtime';
import { Input, Output } from "@/typings/fetch_sketch_schema/fetch_sketch_schema";
import schemas from '@sketch-hq/sketch-file-format'

/**
  * Each file needs to export a function named `handler`. This function is the entrance to the Tool.
  * @param {Object} args.input - input parameters, you can get test input value by input.xxx.
  * @param {Object} args.logger - logger instance used to print logs, injected by runtime
  * @returns {*} The return data of the function, which should match the declared output parameters.
  * 
  * Remember to fill in input/output in Metadata, it helps LLM to recognize and use tool.
  */
export async function handler({ input, logger }: Args<Input>): Promise<Output> {
  const name = input.schemaName
  logger.info(`==> ${name}`)
  logger.info(`==> ${!!schemas[name]}`)
  return {
    success: !!schemas[name],
    data: JSON.stringify(schemas[name] || {})
  }
};