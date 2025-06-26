## Test Case 1 - Kunden anrufen
<img src="https://gripl.mertendieckmann.de/api/dataset/1/preview?correctIds=Activity_0zqrwn8&falsePositiveIds=&falseNegativeIds=&salt=71982.0" alt="Test Case BPMN XML" />

- **Expected:** Kunden anrufen (Activity_0zqrwn8)
- **Actual:** Kunden anrufen (Activity_0zqrwn8)
- **Result:** ✅ Passed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Kunden anrufen** (Activity_0zqrwn8): The activity involves calling customers, which likely involves processing personal data such as customers' names, phone numbers, and potentially other identifying information.

</details>

## Test Case 2 - Persönliche Daten sammeln
<img src="https://gripl.mertendieckmann.de/api/dataset/2/preview?correctIds=Activity_1ucxc3p&falsePositiveIds=&falseNegativeIds=&salt=60191.0" alt="Test Case BPMN XML" />

- **Expected:** Persönliche Daten sammeln (Activity_1ucxc3p)
- **Actual:** Persönliche Daten sammeln (Activity_1ucxc3p)
- **Result:** ✅ Passed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Persönliche Daten sammeln** (Activity_1ucxc3p): The name 'Persönliche Daten sammeln' implies the collection of personal data.

</details>

## Test Case 3 - Invoice Erstellen
<img src="https://gripl.mertendieckmann.de/api/dataset/3/preview?correctIds=Activity_0vdpsz1,Activity_1dttfxu&falsePositiveIds=&falseNegativeIds=&salt=77461.0" alt="Test Case BPMN XML" />

- **Expected:** Identität des Kunden bestätigen (Activity_0vdpsz1), Invoice erstellen 1 (Activity_1dttfxu)
- **Actual:** Identität des Kunden bestätigen (Activity_0vdpsz1), Invoice erstellen 1 (Activity_1dttfxu)
- **Result:** ✅ Passed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Identität des Kunden bestätigen** (Activity_0vdpsz1): The activity 'Identität des Kunden bestätigen' involves confirming the identity of the customer, which implies the processing of personal data (identity information of the customer). Therefore, it is relevant for GDPR compliance.
- **Invoice erstellen 1** (Activity_1dttfxu): The activity 'Invoice erstellen 1' involves creating an invoice, which may contain personal data such as customer names, contact information, or financial details. Therefore, it is relevant for GDPR compliance.

</details>

## Test Case 4 - Pizza Order
<img src="https://gripl.mertendieckmann.de/api/dataset/4/preview?correctIds=Activity_1vbekrj,Activity_1n269gs&falsePositiveIds=&falseNegativeIds=Activity_1p479q4&salt=41190.0" alt="Test Case BPMN XML" />

- **Expected:** Calm Customer (Activity_1p479q4), Pay the Pizza (Activity_1vbekrj), Receive Payment (Activity_1n269gs)
- **Actual:** Pay the Pizza (Activity_1vbekrj), Receive Payment (Activity_1n269gs)
- **Result:** ❌ Failed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Pay the Pizza** (Activity_1vbekrj): The activity 'Pay the Pizza' involves processing payment information which may contain personal data, thus making it relevant for GDPR compliance.
- **Receive Payment** (Activity_1n269gs): The activity 'Receive Payment' involves processing payment information which may contain personal data, thus making it relevant for GDPR compliance.

</details>

## Test Case 5 - Job Application
<img src="https://gripl.mertendieckmann.de/api/dataset/5/preview?correctIds=&falsePositiveIds=sid-2BE041B0-DDB1-4FF2-8744-13DE284FB84F,sid-128D758E-3185-4BA2-8474-8C7C87D35631,sid-9AFFFB8D-44A3-4825-A22B-41CEFBA68BC1&falseNegativeIds=sid-A95ED87A-8B73-4923-B1CE-F2DCC1545F9F&salt=33878.0" alt="Test Case BPMN XML" />

- **Expected:** Collect missing documents (sid-A95ED87A-8B73-4923-B1CE-F2DCC1545F9F)
- **Actual:** Write cover letter (sid-2BE041B0-DDB1-4FF2-8744-13DE284FB84F), Collect documents (sid-128D758E-3185-4BA2-8474-8C7C87D35631), Scan through job postings (sid-9AFFFB8D-44A3-4825-A22B-41CEFBA68BC1)
- **Result:** ❌ Failed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Write cover letter** (sid-2BE041B0-DDB1-4FF2-8744-13DE284FB84F): The element involves the applicant writing a cover letter, which may contain personal data.
- **Collect documents** (sid-128D758E-3185-4BA2-8474-8C7C87D35631): The element involves the applicant collecting documents, which may contain personal data.
- **Scan through job postings** (sid-9AFFFB8D-44A3-4825-A22B-41CEFBA68BC1): The element involves scanning through job postings, which may contain personal data.

</details>

## Test Case 9 - Wäsche waschen
<img src="https://gripl.mertendieckmann.de/api/dataset/9/preview?correctIds=&falsePositiveIds=Activity_11r4kao,Activity_1r6c5dg,Activity_1gj5mgu&falseNegativeIds=Activity_1i1mdys&salt=71737.0" alt="Test Case BPMN XML" />

- **Expected:** Mit Hausmeister telefonieren (Activity_1i1mdys)
- **Actual:** Wäsche aus dem Korb nehmen (Activity_11r4kao), Wäsche in die Waschmaschine tun (Activity_1r6c5dg), Waschmaschine anmachen (Activity_1gj5mgu)
- **Result:** ❌ Failed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Wäsche aus dem Korb nehmen** (Activity_11r4kao): The activity 'Wäsche aus dem Korb nehmen' involves handling personal clothing items, which can contain personal data like identification marks or tags, making it relevant for GDPR compliance.
- **Wäsche in die Waschmaschine tun** (Activity_1r6c5dg): The activity 'Wäsche in die Waschmaschine tun' involves handling personal clothing items, which can contain personal data like identification marks or tags, making it relevant for GDPR compliance.
- **Waschmaschine anmachen** (Activity_1gj5mgu): The activity 'Waschmaschine anmachen' involves handling personal clothing items, which can contain personal data like identification marks or tags, making it relevant for GDPR compliance.

</details>

## Summary
Total: 6
Passed: 3
Failed: 3
