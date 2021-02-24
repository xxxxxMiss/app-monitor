import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common'
import { ObjectSchema } from '@hapi/joi'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}
  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.valid(value)
    if (error) {
      throw new BadRequestException('validation failed')
    }
    return value
  }
}

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }
    const object = plainToClass(metatype, value)
    const errors = await validate(object)

    if (errors.length) {
      throw new BadRequestException('validation failed')
    }
    return value
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Number, Boolean, Object, Array]
    return !types.includes(metatype)
  }
}
