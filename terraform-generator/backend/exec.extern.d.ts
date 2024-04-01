export default interface extern {
  exec: (cmd: string, ops?: (execOptions) | undefined) => string,
  resolve: (path: string) => string,
}
export interface execOptions {
  readonly cwd: string;
}