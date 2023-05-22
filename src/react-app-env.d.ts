declare module "*.less" {
    const content: { [className: string]: string }

    export default content
}

declare module "*"
declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.jpeg';
declare module '*.mjs';



declare namespace NodeJS {
    interface ProcessEnv {
        readonly NODE_ENV: 'development' | 'production' | 'test'
        readonly PUBLIC_URL: string
    }
}
