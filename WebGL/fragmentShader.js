export const fsSource = /*glsl*/`#version 300 es
    precision mediump float;
    in vec4 vColor;
    in vec2 vTextureCoord;
    in vec3 vVertexNormal;
    
    uniform int useColour;
    uniform sampler2D uSampler;
    uniform mat4 uNormalMatrix;
    
    vec3 vLighting;
    
    out vec4 FragColor;

    void main(void) {
        vec4 texelColor = texture(uSampler, vTextureCoord);

        vec3 ambientLight = vec3(0.3, 0.3, 0.3);
        vec3 directionalLightColor = vec3(1, 1, 1);
        vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

        vec4 transformedNormal = uNormalMatrix * vec4(vVertexNormal, 1.0);

        float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);

        
        vLighting = ambientLight + (directionalLightColor * directional);

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