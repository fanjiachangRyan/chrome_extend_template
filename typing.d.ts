declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.jpeg';
declare module '*.mjs';
declare module '*.svg' {
    export function ReactComponent(
        props: React.SVGProps<SVGSVGElement>,
    ): React.ReactElement;

    const url: string;
    export default url;
}

declare module 'less-vars-to-js';

declare module '*';

declare module 'umi';

declare module "crypto-browserify"
