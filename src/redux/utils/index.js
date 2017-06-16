/* eslint-disable */
/* global document, getComputedStyle: true, */
/**
 * http://tzi.fr/js/convert-em-in-px
 */

export const getRootElementFontSize = () => parseFloat(
  getComputedStyle( document.documentElement )
    .fontSize,
);

export const convertRem = value => value * getRootElementFontSize();
