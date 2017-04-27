function glsl() {
    return {

        transform( code, id ) {

            if ( /\.glsl$/.test( id ) === false ) return;

            let transformedCode = 'export default ' + JSON.stringify(
                    code
                        .replace( /[ \t]*\/\/.*\n/g, '' ) // remove //
                        .replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' ) // remove /* */
                        .replace( /\n{2,}/g, '\n' ) // # \n+ to \n
                ) + ';';
            return {
                code: transformedCode,
                map: { mappings: '' }
            };

        }

    };

}

export default {
    entry: 'index.js',
    indent: '\t',
    plugins: [
        glsl()
    ],
    // sourceMap: true,
    targets: [
        {
            format: 'umd',
            moduleName: 'Sampler',
            dest: 'bin/sampler.js'
        },
        {
            format: 'es',
            dest: 'bin/sampler.module.js'
        }
    ]
};