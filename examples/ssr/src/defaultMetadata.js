// Basic metadata for demo
export default function getMetadata(assets) {
    return {
        title: 'Html Metadata Demo',
        htmlAttributes: {lang: 'en'},
        bodyAttributes: {className: 'root'},
        meta: [
            {charset: 'utf-8'}
        ],
        link: [
            { rel: 'stylesheet', href: assets['main.css'] }
        ]
    };
}
