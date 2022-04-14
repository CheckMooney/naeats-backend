import { Transform } from 'class-transformer';

function valueToBoolean(value: any) {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (['true', 'yes', 'on', '1'].includes(value.toLowerCase())) {
    return true;
  }
  if (['false', 'no', 'off', '0'].includes(value.toLowerCase())) {
    return false;
  }
  return undefined;
}

export function TransformBoolean(): PropertyDecorator {
  const toPlain = Transform(
    ({ value }) => {
      return value;
    },
    {
      toPlainOnly: true,
    },
  );
  const toClass = (target: any, propertyKey: string | symbol) => {
    return Transform(
      ({ obj }) => {
        return valueToBoolean(obj[propertyKey]);
      },
      {
        toClassOnly: true,
      },
    )(target, propertyKey);
  };

  return function (target: any, propertyKey: string | symbol) {
    toPlain(target, propertyKey);
    toClass(target, propertyKey);
  };
}
