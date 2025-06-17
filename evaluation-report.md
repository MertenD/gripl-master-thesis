## Test Case 1 - Kunden anrufen
<img src="https://gripl.mertendieckmann.de/api/dataset/1/preview?correctIds=Activity_0zqrwn8&falsePositiveIds=&falseNegativeIds=&salt=12458.0" alt="Test Case BPMN XML" />

- **Expected:** Kunden anrufen (Activity_0zqrwn8)
- **Actual:** Kunden anrufen (Activity_0zqrwn8)
- **Result:** ✅ Passed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Kunden anrufen** (Activity_0zqrwn8): The activity 'Kunden anrufen' involves contacting customers, which likely includes processing personal data such as names or contact information.

</details>

## Test Case 2 - Persönliche Daten sammeln
<img src="https://gripl.mertendieckmann.de/api/dataset/2/preview?correctIds=Activity_0vdpsz1&falsePositiveIds=&falseNegativeIds=&salt=57924.0" alt="Test Case BPMN XML" />

- **Expected:** Persönliche Daten sammeln (Activity_0vdpsz1)
- **Actual:** Persönliche Daten sammeln (Activity_0vdpsz1)
- **Result:** ✅ Passed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Persönliche Daten sammeln** (Activity_0vdpsz1): The activity element is named 'Collect personal data', indicating it involves the collection of personal data.

</details>

## Test Case 3 - Invoice Erstellen
<img src="https://gripl.mertendieckmann.de/api/dataset/3/preview?correctIds=Activity_1dttfxu&falsePositiveIds=&falseNegativeIds=Activity_0vdpsz1&salt=41319.0" alt="Test Case BPMN XML" />

- **Expected:** Identität des Kunden bestätigen (Activity_0vdpsz1), Invoice erstellen 1 (Activity_1dttfxu)
- **Actual:** Invoice erstellen 1 (Activity_1dttfxu)
- **Result:** ❌ Failed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Invoice erstellen 1** (Activity_1dttfxu): The activity 'Invoice erstellen 1' involves creating an invoice which typically contains personal data such as customer names, addresses, and billing information.

</details>

## Summary
Total: 3
Passed: 2
Failed: 1
