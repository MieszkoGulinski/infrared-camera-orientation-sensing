# Satellite orientation sensing using an infrared camera

This project is to validate the algorithm for determining satellite orientation relative to the Earth using an infrared camera onboard the satellite. Such an algorithm is useful for satellites that need to point their cameras towards the Earth's surface, e.g. for Earth observation, or for satellites that require their antennas to be pointed towards the Earth.

## How to run

To install packages: `npm install`
To run: `node index.js`

## Convention of the axes and satellite sides

TODO: add a diagram of the satellite, axes and sides, and the camera placement

The satellite is assumed to be cube-shaped. The axes are named X, Y, Z. The algorithm is intended to keep the Z axis pointing towards the zenith, but does not control the rotation around the Z axis.

The satellite sides are named X+, X-, Y+, Y-, Z+, Z-. The Z+ side is intended to point towards the zenith, and the Z- side is intended to point towards nadir (towards the Earth center). Thermal cameras are placed on the X+, Y+, X- and Y- sides of the satellite, and should see both the Earth's surface and the sky. It's unimportant how the satellite is rotated in the Z axis, as long as the Z+ side is pointing towards the zenith.

If a camera mounted on the X+ side sees imbalance in the (UL+UR)-(LL+LR) value, it means that the satellite needs to be rotated in the Y axis. At the same time, the camera mounted on the X- side should see the same imbalance, but with the opposite sign, and the cameras mounted on the Y+ and Y- sides should see imbalance in the (UL+LR)-(UR+LL) value.

Similarly, if a camera mounted on the X+ side sees imbalance in the (UL+LR)-(UR+LL) value, it means that the satellite needs to be rotated in the X axis. At the same time, the camera mounted on the X- side should see the same imbalance, but with the opposite sign, and the cameras mounted on the Y+ and Y- sides should see imbalance in the (UL+UR)-(LL+LR) value.

If the camera is mounted on the X+ or X- side, the axis perpendicular to the camera view is the Y axis, and the axis parallel to the camera view is the X axis.

## Attitude determination algorithm

The algorithm for determining the satellite's orientation will be as follows:

1. the thermal camera takes a picture
2. the image undergoes thresholding, to distinguish between the Earth's surface and the sky
3. to remove noise, and possibly eliminate Sun or clouds, the binary image is filtered with a median filter, or another morphological filter
4. the image is divided into two halves. Pixels in the upper half not corresponding to the sky, and in the lower half not corresponding to the Earth's surface are marked as "invalid" (set to 1), others are set to 0 (meaning "valid").
5. the image is divided into 4 quadrants, and the number of invalid pixels in each quadrant is calculated; let's call them UL, UR, LL, LR (upper left, upper right, lower left, lower right)
6. (UL+UR)-(LL+LR) is calculated. If it's zero, the satellite is oriented correctly in the axis parallel to Earth and perpendicular to the direction of camera view. If it's positive, the satellite is oriented too much towards the Earth's surface, and if it's negative, the satellite is oriented too much towards the sky, as viewed by the camera.
7. (UL+LR)-(UR+LL) is calculated. If it's zero, the satellite is oriented correctly in the axis parallel to Earth going towards the direction of camera view. If it's positive, the satellite is tilted counterclockwise, and if it's negative, the satellite is tilted too much clockwise from the camera viewpoint.

Then, the orientation of the satellite determined by the algorithm can be used to adjust the satellite's orientation using reaction wheels, magnetic torquers, or other means.

### Multiple cameras

This way, while in principle only one of the cameras is needed to determine and adjust the satellite's orientation, multiple cameras can be used to improve accuracy of the algorithm and robustness against sunlight, noise and cloud cover, and provide redundancy in case of a camera failure.

Direction towards the Sun can be determined using photodiode-based Sun sensors, or by measuring output voltage of the solar panels on each side of the satellite. The view from a camera mounted on a side of the satellite facing the Sun should be ignored, as the sunlight would cause the image to be saturated.

### Assumption about Earth visibility

It is assumed that the limb of the Earth is a straight line. This simplification works when the satellite is on a low Earth orbit, and the camera uses rectilinear projection (it's not a fisheye lens). A satellite on a higher orbit will see the horizon as a section of circle, or even a complete circle, and a different algorithm will be necessary in such case.

### Adaptation of the algorithm to different satellite attitudes

The algorithm can be modified to not necessarily point the Z side of the satellite towards the nadir (assuming the cameras are located on X+, X-, Y+ and Y- sides).

In such case, if we want to tilt the satellite in Y axis:

- the camera mounted on the X+ side will need to have the image divided not into equal quadrants, but the upper "quadrants" should be taller and the lower "quadrants" should be shorter, because the sky will be expected to show in the upper half of the image.
- the camera mounted on the X- side will need to have the image divided not into equal quadrants, but the upper "quadrants" should be shorter and the lower "quadrants" should be taller, because the Earth's surface will be expected to show in the upper half of the image
- the cameras mounted on the Y+ and Y- sides should expect imbalance in the (UL+LR)-(UR+LL) value but not in the (UL+UR)-(LL+LR) value.

Such a modification could be useful e.g. for an Earth observation satellite that needs to point its camera towards a specific location on the Earth's surface.

### Potential issue with clouds

If the Earth is covered with clouds, the algorithm may not work properly. The clouds may be mistaken for the sky, as their temperature as visible in the infrared range may be lower than the lowest temperature measurable by the camera. This problem is described in a [NASA report from 1969](https://ntrs.nasa.gov/api/citations/19700026254/downloads/19700026254.pdf).

To mitigate this issue, image from the camera could be passed through an image processing algorithm that could detect clouds and mask them out. One of the methods to achieve such filtering would be [morphological operations](https://en.wikipedia.org/wiki/Mathematical_morphology) on the image, attempting to remove small dark objects (clouds) from the bright background (Earth's thermal radiation).

### Filtering

The algorithm can be improved by filtering the image before processing it. Because of cosmic rays, the image may contain salt-and-pepper noise, which can be removed by a median filter. To remove clouds from image of the Earth, a morphological filter can be used.

A morphological filter can work by applying morphological [closing](<https://en.wikipedia.org/wiki/Closing_(morphology)>) of the binary image where the sky is marked as 0 and the Earth is marked as 1. Closing is a combination of dilation followed by erosion. This operation removes small dark (0) objects from the bright (1) background, which in this case would be clouds.

## Simulation

Output from the thermal camera will be represented as an array of pixels. The size of the image will be 16x12 pixels, which matches the size of the image from [MLX90641](https://www.melexis.com/en/documents/documentation/datasheets/datasheet-mlx90641) thermal camera. This resolution should be sufficient to determine the satellite's orientation with accuracy of several degrees, which is enough for the satellite to be properly oriented towards the Earth.
