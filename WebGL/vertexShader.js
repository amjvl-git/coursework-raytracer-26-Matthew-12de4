export const vsSource = /*glsl*/`#version 300 es
    precision mediump float;
    in vec4 aVertexPosition;
    in vec3 aVertexNormal;
    in vec2 aTextureCoord;
    in vec4 aVertexColor;

    
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    //uniform float useColour;

    out vec2 vTextureCoord;
    out vec4 vColor;
    out float colourUsed;
    out vec3 vVertexNormal;

    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = aTextureCoord;
        vVertexNormal = aVertexNormal;

        vColor = aVertexColor;
    }
`;