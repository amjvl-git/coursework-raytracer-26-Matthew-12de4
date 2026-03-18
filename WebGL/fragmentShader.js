export const fsSource = /*glsl*/`#version 300 es
    precision mediump float;
    in vec4 vColor;
    in vec2 vTextureCoord;
    in vec3 vLighting;
    uniform int useColour;
    uniform sampler2D uSampler;
    out vec4 FragColor;

    void main(void) {
        vec4 texelColor = texture(uSampler, vTextureCoord);

        if (useColour >= 1) {
            FragColor = vec4(vColor.rgb * vLighting, vColor.a);
            return;
        }
        else if (useColour < 1) {
            FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
            return;
        }
    }
`