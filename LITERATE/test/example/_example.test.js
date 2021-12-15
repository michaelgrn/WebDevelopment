var assert = require('assert');
const two = require('./_example.src');

describe('Number Two', function() {
  describe('Digit', function() {
    it('should be the number two', () => two.shouldBeTwoDigit());
  }),
  describe('Letter', () => {
    it('should be two', () => two.shouldBeTwoLetter());
  }),
  describe('Japanese', () => {
    it('should be ni', () => two.shouldBeTwoJapanese("ni"));
    it('should be ni', () => two.shouldBeTwoJapanese());
  }),
  describe('Twos', () => {
    it('should be twos', () => two.shouldBeTwos( { two: "two", TWO: "TWO"} ));
  }),
  describe('three should not be two', () => {
    it('should not be two', () => two.shouldNotBeThree('3'));
  }),
  describe('Spa', () => {
    it('should be ni', () => two.shouldBeTwoJapanese("ni"));
    it('should be ni', () => two.shouldBeTwoJapanese());
  })
});
