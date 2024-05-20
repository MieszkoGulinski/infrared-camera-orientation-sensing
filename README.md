# Satellite orientation sensing using an infrared camera

This project is to validate the algorithm for determining satellite orientation relative to the Earth using an infrared camera onboard the satellite.

## How to run

To install packages: `npm install`
To run: `node index.js`

## Attitude determination algorithm

The algorithm for adjusting the satellite's orientation will be as follows:

1. the thermal camera takes a picture
2. the image undergoes thresholding, to distinguish between the Earth's surface and the sky
3. to remove noise, and possibly eliminate Sun or clouds, the binary image is filtered with a median filter, or another morphological filter
4. the image is divided into two halves. Pixels in the upper half not corresponding to the sky, and in the lower half not corresponding to the Earth's surface are marked as "invalid" (set to 1), others are set to 0 (meaning "valid").
5. the image is divided into 4 quadrants, and the number of invalid pixels in each quadrant is calculated; let's call them UL, UR, LL, LR (upper left, upper right, lower left, lower right)
6. (UL+UR)-(LL+LR) is calculated. If it's zero, the satellite is oriented correctly in the axis parallel to Earth and perpendicular to the direction of camera view. If it's positive, the satellite is oriented too much towards the Earth's surface, and if it's negative, the satellite is oriented too much towards the sky, as viewed by the camera.
7. (UL+LR)-(UR+LL) is calculated. If it's zero, the satellite is oriented correctly in the axis parallel to Earth going towards the direction of camera view. If it's positive, the satellite is tilted counterclockwise, and if it's negative, the satellite is tilted too much clockwise from the camera viewpoint.
8. using the magnetorques, the satellite's orientation is adjusted so that both of the above values are zero.

The algorithm can be performed on images from several sides of the satellite, to eliminate images from the direction of the Sun, and to provide redundancy in case one of the cameras fails. Direction towards the Sun can be determined using photodiode-based Sun sensors, or by measuring output voltage of the solar panels on each side of the satellite.

## Simulation

Output from the thermal camera will be represented as an array of pixels. The size of the image will be 16x12 pixels, which matches the size of the image from [MLX90641](https://www.melexis.com/en/documents/documentation/datasheets/datasheet-mlx90641) thermal camera. This resolution should be sufficient to determine the satellite's orientation with accuracy of several degrees, which is enough for the satellite to be properly oriented towards the Earth.
