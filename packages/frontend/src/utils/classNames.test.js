import classNames from './classNames';

test('returns string', () => {
    expect(classNames('single')).toBe('single');
});

test('returns strings separated by spaces', () => {
    expect(classNames(['first', 'second'])).toBe('first second');
});

test('returns base string and one conditional', () => {
    expect(classNames(['first', { 'conditional-one' : true }])).toBe('first conditional-one');
});

test('returns base string and no conditional', () => {
    expect(classNames(['first', { 'conditional-one' : false }])).toBe('first');
});

test('returns base string and both conditionals', () => {
    expect(classNames(['first', { 'conditional-one' : true, 'conditional-two' : true }])).toBe('first conditional-one conditional-two');
});

test('returns base string and second conditional', () => {
    expect(classNames(['first', { 'conditional-one' : false, 'conditional-two' : true }])).toBe('first conditional-two');
});