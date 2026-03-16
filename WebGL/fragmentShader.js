export const fsSource = /*glsl*/`
    varying lowp vec4 vColor;
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;
    uniform lowp int useColour;
    uniform sampler2D uSampler;

    void main(void) {
        highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

        if (useColour >= 1) {
            gl_FragColor = vec4(vColor.rgb * vLighting, vColor.a);
            return;
        }
        else if (useColour < 1) {
            gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
            return;
        }
    }
`