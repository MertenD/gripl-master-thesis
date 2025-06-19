## Test Case 1 - Kunden anrufen
<img src="https://gripl.mertendieckmann.de/api/dataset/1/preview?correctIds=Activity_0zqrwn8&falsePositiveIds=&falseNegativeIds=&salt=80963.0" alt="Test Case BPMN XML" />

- **Expected:** Kunden anrufen (Activity_0zqrwn8)
- **Actual:** Kunden anrufen (Activity_0zqrwn8)
- **Result:** ✅ Passed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Kunden anrufen** (Activity_0zqrwn8): This activity 'Kunden anrufen' involves calling customers which may involve processing personal data such as names, phone numbers, and potentially other customer information.

</details>

## Test Case 2 - Persönliche Daten sammeln
<img src="https://gripl.mertendieckmann.de/api/dataset/2/preview?correctIds=Activity_1ucxc3p&falsePositiveIds=&falseNegativeIds=&salt=29473.0" alt="Test Case BPMN XML" />

- **Expected:** Persönliche Daten sammeln (Activity_1ucxc3p)
- **Actual:** Persönliche Daten sammeln (Activity_1ucxc3p)
- **Result:** ✅ Passed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Persönliche Daten sammeln** (Activity_1ucxc3p): The name 'Persönliche Daten sammeln' implies the collection of personal data, which is relevant for GDPR compliance.

</details>

## Test Case 3 - Invoice Erstellen
<img src="https://gripl.mertendieckmann.de/api/dataset/3/preview?correctIds=Activity_1dttfxu&falsePositiveIds=&falseNegativeIds=Activity_0vdpsz1&salt=54040.0" alt="Test Case BPMN XML" />

- **Expected:** Identität des Kunden bestätigen (Activity_0vdpsz1), Invoice erstellen 1 (Activity_1dttfxu)
- **Actual:** Invoice erstellen 1 (Activity_1dttfxu)
- **Result:** ❌ Failed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Invoice erstellen 1** (Activity_1dttfxu): The activity 'Invoice erstellen 1' involves creating an invoice, which typically includes personal data such as customer names, addresses, and payment details.

</details>

## Test Case 4 - Pizza Order
<img src="https://gripl.mertendieckmann.de/api/dataset/4/preview?correctIds=Activity_1vbekrj,Activity_1n269gs&falsePositiveIds=Activity_1ikpcwz&falseNegativeIds=Activity_1p479q4&salt=57547.0" alt="Test Case BPMN XML" />

- **Expected:** Calm Customer (Activity_1p479q4), Pay the Pizza (Activity_1vbekrj), Receive Payment (Activity_1n269gs)
- **Actual:** Ask for the Pizza (Activity_1ikpcwz), Pay the Pizza (Activity_1vbekrj), Receive Payment (Activity_1n269gs)
- **Result:** ❌ Failed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Ask for the Pizza** (Activity_1ikpcwz): The activity 'Ask for the Pizza' implies the processing of personal data as it involves requesting customer information such as name or address for the pizza order.
- **Pay the Pizza** (Activity_1vbekrj): The activity 'Pay the Pizza' is relevant for GDPR compliance as it involves processing payment information which can include personal data such as credit card details or billing address.
- **Receive Payment** (Activity_1n269gs): The activity 'Receive Payment' is relevant for GDPR compliance as it involves processing financial transactions which may include personal data such as bank account details.

</details>

## Test Case 9 - Wäsche waschen
<img src="https://gripl.mertendieckmann.de/api/dataset/9/preview?correctIds=Activity_1i1mdys&falsePositiveIds=&falseNegativeIds=&salt=81517.0" alt="Test Case BPMN XML" />

- **Expected:** Mit Hausmeister telefonieren (Activity_1i1mdys)
- **Actual:** Mit Hausmeister telefonieren (Activity_1i1mdys)
- **Result:** ✅ Passed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Mit Hausmeister telefonieren** (Activity_1i1mdys): The activity involves making a phone call, which may involve processing personal data such as phone numbers or contact details of individuals.

</details>

## Summary
Total: 5
Passed: 3
Failed: 2
