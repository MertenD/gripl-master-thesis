## Test Case 1 - Kunden anrufen
<img src="https://gripl.mertendieckmann.de/api/dataset/1/preview?correctIds=Activity_0zqrwn8&falsePositiveIds=&falseNegativeIds=&salt=63631.0" alt="Test Case BPMN XML" />

- **Expected:** Kunden anrufen (Activity_0zqrwn8)
- **Actual:** Kunden anrufen (Activity_0zqrwn8)
- **Result:** ✅ Passed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Kunden anrufen** (Activity_0zqrwn8): The activity element 'Kunden anrufen' involves contacting customers, which likely involves processing their personal data such as names, phone numbers, or any other relevant information.

</details>

## Test Case 2 - Persönliche Daten sammeln
<img src="https://gripl.mertendieckmann.de/api/dataset/2/preview?correctIds=Activity_0vdpsz1&falsePositiveIds=&falseNegativeIds=&salt=46837.0" alt="Test Case BPMN XML" />

- **Expected:** Persönliche Daten sammeln (Activity_0vdpsz1)
- **Actual:** Persönliche Daten sammeln (Activity_0vdpsz1)
- **Result:** ✅ Passed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Persönliche Daten sammeln** (Activity_0vdpsz1): The activity 'Persönliche Daten sammeln' implies the collection of personal data.

</details>

## Test Case 3 - Invoice Erstellen
<img src="https://gripl.mertendieckmann.de/api/dataset/3/preview?correctIds=Activity_0vdpsz1,Activity_1dttfxu&falsePositiveIds=&falseNegativeIds=&salt=12672.0" alt="Test Case BPMN XML" />

- **Expected:** Identität des Kunden bestätigen (Activity_0vdpsz1), Invoice erstellen 1 (Activity_1dttfxu)
- **Actual:** Identität des Kunden bestätigen (Activity_0vdpsz1), Invoice erstellen 1 (Activity_1dttfxu)
- **Result:** ✅ Passed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Identität des Kunden bestätigen** (Activity_0vdpsz1): The activity 'Identität des Kunden bestätigen' implies the processing of customer identity data, which falls under personal data as per GDPR.
- **Invoice erstellen 1** (Activity_1dttfxu): The activity 'Invoice erstellen 1' involves creating invoices, which likely contain personal data such as customer names and billing information, making it relevant for GDPR compliance.

</details>

## Test Case 4 - Pizza Order
<img src="https://gripl.mertendieckmann.de/api/dataset/4/preview?correctIds=Activity_1vbekrj,Activity_1n269gs&falsePositiveIds=&falseNegativeIds=Activity_1p479q4&salt=41220.0" alt="Test Case BPMN XML" />

- **Expected:** Calm Customer (Activity_1p479q4), Pay the Pizza (Activity_1vbekrj), Receive Payment (Activity_1n269gs)
- **Actual:** Pay the Pizza (Activity_1vbekrj), Receive Payment (Activity_1n269gs)
- **Result:** ❌ Failed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Pay the Pizza** (Activity_1vbekrj): The activity 'Pay the Pizza' involves processing payment information which may include personal data.
- **Receive Payment** (Activity_1n269gs): The activity 'Receive Payment' involves processing payment information which may include personal data.

</details>

## Summary
Total: 4
Passed: 3
Failed: 1
