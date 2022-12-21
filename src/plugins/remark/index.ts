import { load } from 'js-yaml';
import { timerify } from '../../util/performance.js';
import type { IsPluginEnabledCallback, GenericPluginCallback } from '../../types/plugins.js';

// https://github.com/remarkjs/remark/blob/main/packages/remark-cli/readme.md

type RemarkConfig = {
  plugins: string[];
};

export const isEnabled: IsPluginEnabledCallback = ({ dependencies }) => dependencies.has('remark-cli');

export const CONFIG_FILE_PATTERNS = [
  'package.json',
  '.remarkrc',
  '.remarkrc.json',
  '.remarkrc.{js,cjs,mjs}',
  '.remarkrc.{yml,yaml}',
];

const findRemarkDependencies: GenericPluginCallback = async (configFilePath, { manifest }) => {
  const config = configFilePath.endsWith('package.json') ? manifest.remarkConfig : await load(configFilePath);
  const plugins = (config as RemarkConfig)?.plugins?.map(plugin => `remark-${plugin}`) ?? [];
  return [...plugins];
};

export const findDependencies = timerify(findRemarkDependencies);
