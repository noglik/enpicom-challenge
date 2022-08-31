import { expect } from 'chai';
import { add } from './index';

describe('add', () => {
    it('should add two numbers', () => {
        expect(add(2, 2)).to.be.eql(4);
    });
});
