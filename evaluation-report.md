## Test Case 1 - Kunden anrufen
<img src="https://gripl.mertendieckmann.de/api/dataset/1/preview?correctIds=Activity_0zqrwn8&falsePositiveIds=&falseNegativeIds=&salt=83432.0" alt="Test Case BPMN XML" />

- **Expected:** Kunden anrufen (Activity_0zqrwn8)
- **Actual:** Kunden anrufen (Activity_0zqrwn8)
- **Result:** ✅ Passed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Kunden anrufen** (Activity_0zqrwn8): The activity 'Kunden anrufen' involves contacting customers, which may require handling personal data such as names or contact information.

</details>

## Test Case 2 - Persönliche Daten sammeln
<img src="https://gripl.mertendieckmann.de/api/dataset/2/preview?correctIds=Activity_1ucxc3p&falsePositiveIds=&falseNegativeIds=&salt=55797.0" alt="Test Case BPMN XML" />

- **Expected:** Persönliche Daten sammeln (Activity_1ucxc3p)
- **Actual:** Persönliche Daten sammeln (Activity_1ucxc3p)
- **Result:** ✅ Passed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Persönliche Daten sammeln** (Activity_1ucxc3p): The name 'Persönliche Daten sammeln' implies the collection of personal data.

</details>

## Test Case 3 - Invoice Erstellen
<img src="https://gripl.mertendieckmann.de/api/dataset/3/preview?correctIds=Activity_1dttfxu&falsePositiveIds=&falseNegativeIds=Activity_0vdpsz1&salt=71703.0" alt="Test Case BPMN XML" />

- **Expected:** Identität des Kunden bestätigen (Activity_0vdpsz1), Invoice erstellen 1 (Activity_1dttfxu)
- **Actual:** Invoice erstellen 1 (Activity_1dttfxu)
- **Result:** ❌ Failed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Invoice erstellen 1** (Activity_1dttfxu): The activity 'Invoice erstellen 1' involves creating an invoice which typically includes personal data such as names, addresses, and payment information of customers.

</details>

## Test Case 4 - Pizza Order
<img src="https://gripl.mertendieckmann.de/api/dataset/4/preview?correctIds=Activity_1vbekrj,Activity_1n269gs&falsePositiveIds=&falseNegativeIds=Activity_1p479q4&salt=11492.0" alt="Test Case BPMN XML" />

- **Expected:** Calm Customer (Activity_1p479q4), Pay the Pizza (Activity_1vbekrj), Receive Payment (Activity_1n269gs)
- **Actual:** Pay the Pizza (Activity_1vbekrj), Receive Payment (Activity_1n269gs)
- **Result:** ❌ Failed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Pay the Pizza** (Activity_1vbekrj): The activity 'Pay the Pizza' involves a payment transaction, which typically involves processing personal data such as payment information.
- **Receive Payment** (Activity_1n269gs): The activity 'Receive Payment' involves receiving payment from a customer, which may involve processing personal payment information.

</details>

## Summary
Total: 4
Passed: 2
Failed: 2
