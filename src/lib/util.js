//此方法取自博客 https://www.cnblogs.com/milo-xie/p/6602031.html
export function deepGet(object, path, defaultValue) {
  return (!Array.isArray(path) ? path.replace(/\[/g, '.').replace(/\]/g, '').split('.') : path)
    .reduce((o, k) => (o || {})[k], object) || defaultValue;
}
