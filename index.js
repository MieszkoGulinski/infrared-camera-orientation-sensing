const calculateBalance = require("./calculateBalance");

const width = 16;
const height = 12;
const temperatureThreshold = -20; // threshold for the temperature, in Celsius, for a pixel to be considered as Earth

// Output from the thermal camera is represented by a 16x12 grid of integer numbers representing the temperature in Celsius.
// The output is stored in a 1-dimensional array of 192 bytes. The first byte represents the temperature at the top left corner of the grid.
// In the simulation, the range of the visible temperature is from -128 to 127 degrees Celsius.
// In reality, the temperature will be clamped to the range of the sensor, roughly -40 to +300 degrees Celsius.

// Case 1: The satellite is correctly oriented - the upper half of the image is the sky, the lower half is the Earth.
// The temperature of the sky and the Earth is uniform. Should return that the satellite is correctly oriented and does not need to be rotated.
// prettier-ignore
const correctlyOriented = new Int8Array([
  // --- Upper half - sky should be here ---
  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,
  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,

  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,
  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,

  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,
  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,

  // --- Lower half - Earth should be here ---
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,

  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,

  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,
]);

console.log(
  calculateBalance(correctlyOriented, width, height, temperatureThreshold)
);

// Case 2: The satellite is correctly oriented - the upper half of the image is the sky, the lower half is the Earth.
// The temperature of the sky and the Earth is uniform, but the temperature in the image varies by at most +/-10 C. The result should be still zero.
// prettier-ignore
const correctlyOrientedWithNoise = new Int8Array([
  // --- Upper half ---
  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,
  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,

  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,
  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,

  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,
  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,

  // --- Lower half ---
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,

  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,

  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,
]);
for (let i = 0; i < correctlyOrientedWithNoise.length; i++) {
  const noise = Math.round(Math.random() * 20 - 10);
  correctlyOrientedWithNoise[i] += noise;
}

console.log(
  calculateBalance(
    correctlyOrientedWithNoise,
    width,
    height,
    temperatureThreshold
  )
);

// Case 3: The satellite is slightly rotated in the axis perpendicular to the camera direction. The upper half of the image shows the sky AND Earth, and the lower half shows Earth.
// Should return that the satellite is slightly rotated in the perpendicular axis, but not in the parallel axis.

// prettier-ignore
const tiltedPerpendicularAxis = new Int8Array([
  // --- Upper half ---
  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,
  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,

  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,
  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,

  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,

  // --- Lower half ---
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,

  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,

  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,
]);

console.log(
  calculateBalance(tiltedPerpendicularAxis, width, height, temperatureThreshold)
);

// Case 4: The satellite is rotated in the axis parallel to the camera direction. The image is tilted by 45 degrees.
// As the image is tilted clockwise, the satellite is tilted in the counter-clockwise direction from the camera's perspective.
// Should return that the satellite is rotated in the parallel axis, but not in the perpendicular axis.

// prettier-ignore
const tiltedParallelAxis = new Int8Array([
  // --- Upper half ---
  10, -40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,
  10, 10, -40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,

  10, 10, 10, -40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,
  10, 10, 10, 10,  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,

  10, 10, 10, 10,  10, -40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,
  10, 10, 10, 10,  10, 10, -40,-40, -40,-40,-40,-40, -40,-40,-40,-40,

  // --- Lower half ---
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10,-40,-40, -40,-40,-40,-40,
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10,-40, -40,-40,-40,-40,

  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10, -40,-40,-40,-40,
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10,-40,-40,-40,

  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10,-40,-40,
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10,-40
]);
console.log(
  calculateBalance(tiltedParallelAxis, width, height, temperatureThreshold)
);

// Case 5: The satellite is rotated in both axes. The image partly shows the sky in the upper right corner.
// As the image is tilted clockwise, the satellite is tilted in the counter-clockwise direction from the camera's perspective.
// prettier-ignore
const tiltedBothAxes = new Int8Array([
  // --- Upper half ---
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10,-40,-40, -40,-40,-40,-40,
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10,-40, -40,-40,-40,-40,

  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10, -40,-40,-40,-40,
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10,-40,-40,-40,

  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10,-40,-40,
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10,-40,

  // --- Lower half ---
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,

  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,

  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,
]);
console.log(
  calculateBalance(tiltedBothAxes, width, height, temperatureThreshold)
);

// Case 6: The satellite is rotated in the axis perpendicular to the camera direction. The upper half of the image shows the sky, and the lower half shows Earth and sky.
// Should return that the satellite is slightly rotated in the perpendicular axis, but not in the parallel axis, and should return negative value for the rotation in the perpendicular axis.
// prettier-ignore
const tiltedPerpendicularAxisReverse = new Int8Array([
  // --- Upper half ---
  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,
  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,

  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,
  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,

  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,
  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,

  // --- Lower half ---
  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,
  -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40, -40,-40,-40,-40,

  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,

  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,
  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,  10, 10, 10, 10,
]);
console.log(
  calculateBalance(
    tiltedPerpendicularAxisReverse,
    width,
    height,
    temperatureThreshold
  )
);

// TODO:
// Case 7: similar to case 5, but the sky is visible in the upper left corner instead.
// Case 8: the Earth is visible only in the lower left corner, rest is sky.
// Case 9: the Earth is visible only in the lower right corner, rest is sky.
// Case 10: the image shows only the sky. In this case, the function should tell the satellite to keep rotating until the Earth is visible.
// Case 11: the image shows only the Earth. In this case, the function should tell the satellite to keep rotating until the sky is visible, but in the opposite direction.
// Case 12: the image shows the sky in the lower half and the Earth in the upper half. The satellite is rotated by 180 degrees in the perpendicular axis. The function should tell the satellite to keep rotating in the perpendicular axis.

// Next cases should be identical to the previous cases, but the image should include salt-and-pepper noise (random pixels with extreme values), simulating the effect of cosmic rays on the image sensor.
// The function should return numbers close to the previous cases. The larger the noise, the difference should be larger.

// TODO: add a median or a morphological filter to the image to attempt to remove the noise and check how much it affects the result.
