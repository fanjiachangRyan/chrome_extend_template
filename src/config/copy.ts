import copyText from 'copy-to-clipboard';
import { message } from 'antd';

const copy = (text: string) => {
  try {
    copyText(text);
    message.success('copy success!');
  } catch (e: any) {
    message.error('copy failed!');
  }
};

export default copy;
