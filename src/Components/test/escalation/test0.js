test('rule1', () => {
  expect(rule1(patientMedications, masterMedications)).toBe('recommendations');
});