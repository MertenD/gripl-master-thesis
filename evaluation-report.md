## Test Case 1
**Input:** <img src="https://gripl.mertendieckmann.de/api/dataset/1/preview?correctIds=Activity_0zqrwn8&falsePositiveIds=&falseNegativeIds=" alt="Test Case BPMN XML" height="200" />
**Expected:** Activity_0zqrwn8
**Actual:** Activity_0zqrwn8
**Result:** ✅ Passed

## Test Case 2
**Input:** <img src="https://gripl.mertendieckmann.de/api/dataset/2/preview?correctIds=Activity_0vdpsz1&falsePositiveIds=&falseNegativeIds=" alt="Test Case BPMN XML" height="200" />
**Expected:** Activity_0vdpsz1
**Actual:** Activity_0vdpsz1
**Result:** ✅ Passed

## Test Case 3
**Input:** <img src="https://gripl.mertendieckmann.de/api/dataset/3/preview?correctIds=Activity_1dttfxu&falsePositiveIds=&falseNegativeIds=Activity_0vdpsz1" alt="Test Case BPMN XML" height="200" />
**Expected:** Activity_0vdpsz1, Activity_1dttfxu
**Actual:** Activity_1dttfxu
**Result:** ❌ Failed

## Summary
Total: 3
Passed: 2
Failed: 1
