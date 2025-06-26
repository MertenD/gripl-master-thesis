## Test Case 1 - Kunden anrufen
<img src="https://gripl.mertendieckmann.de/api/dataset/1/preview?correctIds=Activity_0zqrwn8&falsePositiveIds=&falseNegativeIds=&salt=75069.0" alt="Test Case BPMN XML" />

- **Expected:** Kunden anrufen (Activity_0zqrwn8)
- **Actual:** Kunden anrufen (Activity_0zqrwn8)
- **Result:** ✅ Passed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Kunden anrufen** (Activity_0zqrwn8): The activity 'Kunden anrufen' involves contacting customers, which likely includes processing their personal data such as names or contact information.

</details>

## Test Case 2 - Persönliche Daten sammeln
<img src="https://gripl.mertendieckmann.de/api/dataset/2/preview?correctIds=Activity_1ucxc3p&falsePositiveIds=&falseNegativeIds=&salt=69364.0" alt="Test Case BPMN XML" />

- **Expected:** Persönliche Daten sammeln (Activity_1ucxc3p)
- **Actual:** Persönliche Daten sammeln (Activity_1ucxc3p)
- **Result:** ✅ Passed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Persönliche Daten sammeln** (Activity_1ucxc3p): The activity is named 'Collect Personal Data', indicating that personal data is being collected.

</details>

## Test Case 3 - Invoice Erstellen
<img src="https://gripl.mertendieckmann.de/api/dataset/3/preview?correctIds=Activity_0vdpsz1,Activity_1dttfxu&falsePositiveIds=&falseNegativeIds=&salt=97372.0" alt="Test Case BPMN XML" />

- **Expected:** Identität des Kunden bestätigen (Activity_0vdpsz1), Invoice erstellen 1 (Activity_1dttfxu)
- **Actual:** Identität des Kunden bestätigen (Activity_0vdpsz1), Invoice erstellen 1 (Activity_1dttfxu)
- **Result:** ✅ Passed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Identität des Kunden bestätigen** (Activity_0vdpsz1): The activity 'Identität des Kunden bestätigen' implies processing of customer identity information which is considered personal data under GDPR.
- **Invoice erstellen 1** (Activity_1dttfxu): The activity 'Invoice erstellen 1' involves creating invoices which may contain personal data such as customer names, addresses, or financial information.

</details>

## Test Case 4 - Pizza Order
<img src="https://gripl.mertendieckmann.de/api/dataset/4/preview?correctIds=Activity_1vbekrj,Activity_1n269gs&falsePositiveIds=&falseNegativeIds=Activity_1p479q4&salt=9767.0" alt="Test Case BPMN XML" />

- **Expected:** Calm Customer (Activity_1p479q4), Pay the Pizza (Activity_1vbekrj), Receive Payment (Activity_1n269gs)
- **Actual:** Pay the Pizza (Activity_1vbekrj), Receive Payment (Activity_1n269gs)
- **Result:** ❌ Failed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Pay the Pizza** (Activity_1vbekrj): The activity 'Pay the Pizza' implies processing payment information which may include personal data such as credit card details.
- **Receive Payment** (Activity_1n269gs): The activity 'Receive Payment' involves processing payment information which may contain personal data.

</details>

## Test Case 9 - Wäsche waschen
<img src="https://gripl.mertendieckmann.de/api/dataset/9/preview?correctIds=&falsePositiveIds=Activity_11r4kao,Activity_1r6c5dg&falseNegativeIds=Activity_1i1mdys&salt=67590.0" alt="Test Case BPMN XML" />

- **Expected:** Mit Hausmeister telefonieren (Activity_1i1mdys)
- **Actual:** Wäsche aus dem Korb nehmen (Activity_11r4kao), Wäsche in die Waschmaschine tun (Activity_1r6c5dg)
- **Result:** ❌ Failed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Wäsche aus dem Korb nehmen** (Activity_11r4kao): The activity 'Wäsche aus dem Korb nehmen' involves handling potentially personal data like clothing items, which could be linked to identifiable individuals.
- **Wäsche in die Waschmaschine tun** (Activity_1r6c5dg): The activity 'Wäsche in die Waschmaschine tun' involves handling potentially personal data like clothing items, which could be linked to identifiable individuals.

</details>

## Summary
Total: 5
Passed: 3
Failed: 2
