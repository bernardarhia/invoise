export default (object, objectKey) => {
  !object.hasOwnProperty(objectKey)
    ? delete object.dataValues[objectKey]
    : delete object[objectKey];

  return object || {};
};
