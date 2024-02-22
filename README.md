# frame-cube

The 3x3x3 Rubik's Cube is designed for a Farcaster frame.

# Rubik's Cube Notation Guide

This guide explains the notation used in this Rubik's Cube project to perform rotations and manipulate the cube.

## Basic Rules

- **Lowercase letters**: Turn the specified layer or the entire cube clockwise.
- **Uppercase letters**: Turn the specified layer or the entire cube counterclockwise.
- **Multiple Actions**: Separate commands with a space to perform multiple actions in sequence. Example: `u R` turns the Up layer clockwise and then the Right layer counterclockwise.

## Face Rotation

Control individual layers of the cube:

- **u (U)**: Up - The top layer.
- **f (F)**: Front - The layer facing you.
- **b (B)**: Back - The layer opposite the front.
- **l (L)**: Left - The layer on the left side.
- **r (R)**: Right - The layer on the right side.
- **d (D)**: Down - The bottom layer.

## Middle Layer Rotation

Manipulate the slices between the outer layers:

- **m (M)**: Middle - The layer between Left and Right.
- **e (E)**: Equatorial - The layer between Up and Down.
- **s (S)**: Standing - The layer between Front and Back.

## View Angle Rotation

Rotate the entire cube:

- **x**: Rotate 90° around the X-axis.
- **y**: Rotate 90° around the Y-axis.
- **z**: Rotate 90° around the Z-axis.

## Special Commands

- **reset**: Start a new, randomized cube. Use this to reset and scramble the cube for a new solving challenge.

## Example

To rotate the top layer clockwise and then the front layer counterclockwise, you would use the notation: `u F`.