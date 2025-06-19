## Test Case 1 - Kunden anrufen
<img src="https://gripl.mertendieckmann.de/api/dataset/1/preview?correctIds=Activity_0zqrwn8&falsePositiveIds=&falseNegativeIds=&salt=81116.0" alt="Test Case BPMN XML" />

- **Expected:** Kunden anrufen (Activity_0zqrwn8)
- **Actual:** Kunden anrufen (Activity_0zqrwn8)
- **Result:** ✅ Passed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Kunden anrufen** (Activity_0zqrwn8): The activity 'Kunden anrufen' involves contacting customers, which likely involves processing personal data such as names or contact information.

</details>

## Test Case 2 - Persönliche Daten sammeln
<img src="https://gripl.mertendieckmann.de/api/dataset/2/preview?correctIds=&falsePositiveIds=Activity_1ucxc3p&falseNegativeIds=Activity_03s0kk5&salt=29928.0" alt="Test Case BPMN XML" />

- **Expected:** Nachricht senden (Activity_03s0kk5)
- **Actual:** Persönliche Daten sammeln (Activity_1ucxc3p)
- **Result:** ❌ Failed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Persönliche Daten sammeln** (Activity_1ucxc3p): The name 'Persönliche Daten sammeln' implies the collection of personal data.

</details>

## Test Case 3 - Invoice Erstellen
<img src="https://gripl.mertendieckmann.de/api/dataset/3/preview?correctIds=Activity_0vdpsz1,Activity_1dttfxu&falsePositiveIds=&falseNegativeIds=&salt=51139.0" alt="Test Case BPMN XML" />

- **Expected:** Identität des Kunden bestätigen (Activity_0vdpsz1), Invoice erstellen 1 (Activity_1dttfxu)
- **Actual:** Identität des Kunden bestätigen (Activity_0vdpsz1), Invoice erstellen 1 (Activity_1dttfxu)
- **Result:** ✅ Passed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Identität des Kunden bestätigen** (Activity_0vdpsz1): The activity 'Identität des Kunden bestätigen' implies the confirmation of the customer's identity, which involves personal data processing.
- **Invoice erstellen 1** (Activity_1dttfxu): The activity 'Invoice erstellen 1' involves the creation of an invoice, which typically contains personal data such as customer information.

</details>

## Test Case 4 - Pizza Order
<img src="https://gripl.mertendieckmann.de/api/dataset/4/preview?correctIds=Activity_1vbekrj,Activity_1n269gs&falsePositiveIds=&falseNegativeIds=Activity_1p479q4&salt=2484.0" alt="Test Case BPMN XML" />

- **Expected:** Calm Customer (Activity_1p479q4), Pay the Pizza (Activity_1vbekrj), Receive Payment (Activity_1n269gs)
- **Actual:** Pay the Pizza (Activity_1vbekrj), Receive Payment (Activity_1n269gs)
- **Result:** ❌ Failed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Pay the Pizza** (Activity_1vbekrj): The activity 'Pay the Pizza' involves a financial transaction, which may involve personal data such as payment details.
- **Receive Payment** (Activity_1n269gs): The activity 'Receive Payment' involves handling payment information which can contain personal data of the individual making the payment.

</details>

## Summary
Total: 4
Passed: 2
Failed: 2
