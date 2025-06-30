## Test Case 1 - Kunden anrufen
<img src="https://gripl.mertendieckmann.de/api/dataset/1/preview?correctIds=Activity_0zqrwn8&falsePositiveIds=&falseNegativeIds=&salt=36193.0" alt="Test Case BPMN XML" />

- **Expected:** Kunden anrufen (Activity_0zqrwn8)
- **Actual:** Kunden anrufen (Activity_0zqrwn8)
- **Result:** ✅ Passed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Kunden anrufen** (Activity_0zqrwn8): The activity 'Kunden anrufen' involves contacting customers, which may involve processing personal data such as names and contact information.

</details>

## Test Case 2 - Persönliche Daten sammeln
<img src="https://gripl.mertendieckmann.de/api/dataset/2/preview?correctIds=Activity_1ucxc3p&falsePositiveIds=&falseNegativeIds=&salt=5483.0" alt="Test Case BPMN XML" />

- **Expected:** Persönliche Daten sammeln (Activity_1ucxc3p)
- **Actual:** Persönliche Daten sammeln (Activity_1ucxc3p)
- **Result:** ✅ Passed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Persönliche Daten sammeln** (Activity_1ucxc3p): The name 'Persönliche Daten sammeln' implies that this activity involves collecting personal data.

</details>

## Test Case 3 - Invoice Erstellen
<img src="https://gripl.mertendieckmann.de/api/dataset/3/preview?correctIds=Activity_1dttfxu&falsePositiveIds=&falseNegativeIds=Activity_0vdpsz1&salt=83045.0" alt="Test Case BPMN XML" />

- **Expected:** Identität des Kunden bestätigen (Activity_0vdpsz1), Invoice erstellen 1 (Activity_1dttfxu)
- **Actual:** Invoice erstellen 1 (Activity_1dttfxu)
- **Result:** ❌ Failed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Invoice erstellen 1** (Activity_1dttfxu): The activity 'Invoice erstellen 1' involves creating an invoice, which typically contains personal data such as names, addresses, and potentially other identifiable information of customers.

</details>

## Test Case 4 - Pizza Order
<img src="https://gripl.mertendieckmann.de/api/dataset/4/preview?correctIds=Activity_1vbekrj,Activity_1n269gs&falsePositiveIds=&falseNegativeIds=Activity_1p479q4&salt=14504.0" alt="Test Case BPMN XML" />

- **Expected:** Calm Customer (Activity_1p479q4), Pay the Pizza (Activity_1vbekrj), Receive Payment (Activity_1n269gs)
- **Actual:** Pay the Pizza (Activity_1vbekrj), Receive Payment (Activity_1n269gs)
- **Result:** ❌ Failed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Pay the Pizza** (Activity_1vbekrj): The activity 'Pay the Pizza' involves processing payment information which may include personal data such as credit card details.
- **Receive Payment** (Activity_1n269gs): The activity 'Receive Payment' involves processing payment information which may include personal data such as payment details.

</details>

## Test Case 5 - Job Application
<img src="https://gripl.mertendieckmann.de/api/dataset/5/preview?correctIds=&falsePositiveIds=sid-128D758E-3185-4BA2-8474-8C7C87D35631&falseNegativeIds=sid-A95ED87A-8B73-4923-B1CE-F2DCC1545F9F&salt=18096.0" alt="Test Case BPMN XML" />

- **Expected:** Collect missing documents (sid-A95ED87A-8B73-4923-B1CE-F2DCC1545F9F)
- **Actual:** Collect documents (sid-128D758E-3185-4BA2-8474-8C7C87D35631)
- **Result:** ❌ Failed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Collect documents** (sid-128D758E-3185-4BA2-8474-8C7C87D35631): Collecting personal data for cover letter

</details>

## Test Case 6 - Payment
<img src="https://gripl.mertendieckmann.de/api/dataset/6/preview?correctIds=&falsePositiveIds=sid-D4FD439E-1724-4741-9D37-9BBBE0667B73,sid-5D21E84E-DE2E-4A83-8EEF-70010BC36203,sid-0CA54FF7-B3AB-4EA5-AF56-FFD3CA6D6080&falseNegativeIds=&salt=7426.0" alt="Test Case BPMN XML" />

- **Expected:** 
- **Actual:** Issue summary proceedings (sid-D4FD439E-1724-4741-9D37-9BBBE0667B73), File police report (sid-5D21E84E-DE2E-4A83-8EEF-70010BC36203), Create customer letter regarding blocking (sid-0CA54FF7-B3AB-4EA5-AF56-FFD3CA6D6080)
- **Result:** ❌ Failed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Issue summary proceedings** (sid-D4FD439E-1724-4741-9D37-9BBBE0667B73): Involves issuing summary proceedings, which may contain personal data
- **File police report** (sid-5D21E84E-DE2E-4A83-8EEF-70010BC36203): Activity related to filing a police report, potentially containing personal information
- **Create customer letter regarding blocking** (sid-0CA54FF7-B3AB-4EA5-AF56-FFD3CA6D6080): Creating a customer letter regarding blocking, may involve personal data

</details>

## Test Case 7 - Hospital
<img src="https://gripl.mertendieckmann.de/api/dataset/7/preview?correctIds=&falsePositiveIds=sid-E48A3AD3-F95E-468A-95B9-A207DF9ECA2A,sid-6EB623E3-3FE1-47D8-B423-7B1A3A234F7B,sid-ADE9D51A-36A5-4FDA-ABC7-F193B72886F1,sid-B4F8BBEC-DCC9-436B-92AD-8536D7155D20&falseNegativeIds=&salt=84802.0" alt="Test Case BPMN XML" />

- **Expected:** 
- **Actual:** Conducting the dismissal interview (sid-E48A3AD3-F95E-468A-95B9-A207DF9ECA2A), Dispense medication (sid-6EB623E3-3FE1-47D8-B423-7B1A3A234F7B), Issue the prescription (sid-ADE9D51A-36A5-4FDA-ABC7-F193B72886F1), Issue the discharge papers (sid-B4F8BBEC-DCC9-436B-92AD-8536D7155D20)
- **Result:** ❌ Failed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Conducting the dismissal interview** (sid-E48A3AD3-F95E-468A-95B9-A207DF9ECA2A): The element is conducting the dismissal interview, which may involve discussing personal or sensitive information with the patient.
- **Dispense medication** (sid-6EB623E3-3FE1-47D8-B423-7B1A3A234F7B): The element is dispensing medication, which involves processing personal health information.
- **Issue the prescription** (sid-ADE9D51A-36A5-4FDA-ABC7-F193B72886F1): The element is issuing a prescription, which involves processing personal health information.
- **Issue the discharge papers** (sid-B4F8BBEC-DCC9-436B-92AD-8536D7155D20): The element is issuing the discharge papers, which involves processing personal health information.

</details>

## Test Case 9 - Wäsche waschen
<img src="https://gripl.mertendieckmann.de/api/dataset/9/preview?correctIds=&falsePositiveIds=Activity_11r4kao,Activity_1r6c5dg&falseNegativeIds=Activity_1i1mdys&salt=6706.0" alt="Test Case BPMN XML" />

- **Expected:** Mit Hausmeister telefonieren (Activity_1i1mdys)
- **Actual:** Wäsche aus dem Korb nehmen (Activity_11r4kao), Wäsche in die Waschmaschine tun (Activity_1r6c5dg)
- **Result:** ❌ Failed

<details>
<summary><h3>Reasoning of the LLM</h3></summary>

- **Wäsche aus dem Korb nehmen** (Activity_11r4kao): The activity 'Wäsche aus dem Korb nehmen' involves handling personal items such as clothing which may contain personal data, making it relevant for GDPR compliance.
- **Wäsche in die Waschmaschine tun** (Activity_1r6c5dg): The activity 'Wäsche in die Waschmaschine tun' involves handling personal items such as clothing which may contain personal data, making it relevant for GDPR compliance.

</details>

## Summary
Total: 8
Passed: 2
Failed: 6
