# Identifying GDPR‑Critical Tasks in Business Processes using Large Language Models

Ein binäres Screening mit Fokus auf europäischen Open-Source Modellen

## 1. Einleitung

### 1.1 Motivation

- Businessprozesse sind überall
- Datenschutz relevant in Europa
- Datenschutzprüfungen in Prozessen sind kosten- und zeitintensiv
- Fehlerhafte Unterentdeckung ist ggf. kritisch (False Negatives)
- LLMs versprechen schnelles Screening (Vor allem europäische Open Source Modelle sind interessant); dafür werden jedoch noch belastbare Evidenz und reproduzierbare Vergleiche benötigt

### 1.2 Problemstellung

- Es fehlt ein standardisierter reproduzierbarer Vergleich verschiedener Modelle für die Aufgabe Aktivitäten in Business Prozessen nach kritisch oder nicht kritisch zu klassifizieren
- Besonders interessant ist wie sich Open Source EU Modelle schlagen und welche Trade-offs ggf. entstehen

### 1.3 Zielsetzung und Beiträge

- Eine Klassifizierungspipeline für Businessprozesse (Aktivitäten nach datenschutzkritisch/nicht kritisch klassifizieren, binäre Klassifikation)
- Ein Evaluationsframework zum vergleich beliebiger Modelle und Algorithmen über eine einheitliche Schnittstelle unter der Nutzung gelabelter Businessprozesse
- Eine Labelingsoftware für das Erstellen und Labeln von Datensätzen für die Evaluierung
- Erstellung eines repräsentativen Datensatzes aus gelabelten Businessprozessen (Inkl. Erklärung nach welchen Kriterien gelabelt wurde)
- Empirische Befunde um die Forschungsfragen beantworten zu können

### 1.4 Forschungsfrage und Unterfragen

- Forschungsfrage: Wie zuverlässig identifizieren große Sprachmodelle DSGVO kritische Aktivitäten in BPMN Prozessmodellen?
- Unterfragen: Wie gut schneiden die EU-Modelle gegen Internationale ab? Wie gut schneiden große Modelle gegen Kleine ab? Welche Open-Source-Modelle (insbesondere aus Europa) schneiden besonders gut ab? Wie gut schneiden Open-Source-Modelle gegen kommerzielle Modelle ab (z.B. GPT-4o)?
- Begründung warum binäres Labeln erst einmal hinreichend für ein erstes Screening ist. Eine Detailprüfung folgt im nachfolgendem Schritt (Nicht mehr Teil dieser Masterarbeit)

### 1.5 Aufbau der Arbeit

- Kurzer Überblick über jedes Kapitel (Vom Kontext über Algorithmus, Framework (Labeling & Evaluierung) hin zu Durchführung, Ergebnisse und abschließend Diskussion)

## 2. Hintergrund und verwandte Arbeiten

### 2.1 DSGVO

- Definitionen: Personenbezogene Daten, Verarbeitung, typische Auslöser für "kritisch" (Erhebung, Nutzung, Speichern, Übermitteln, Löschen, ...)
- Abgrenzung, dass es sich hier bei den Klassifizierungen durch die Algorithmen nur um ein Risiko Screening handelt und nicht um eine Rechtsberatung (Sollte ich vielleicht erwähnen, damit auch die Ergebnisse am Ende besser eingeordnet werden können)

### 2.2 BPMN

- Relevante Elemente wie Aktivitäten, Datenobjekte/-speicher, Nachrichtenflüsse, Pools/Lanes, Assoziationen
- Rolle von Elementen, welche zusätzliche Hinweise auf verarbeitung von personenbezogenen Daten geben (Bspw. Aktivtät holt sich Informationen aus einer Datenbank wo Kundendaten gespeichert sind; dargestellt durch Assoziation)
- BpmnXML erläutern, weil das auch das Format ist in dem Businessprozesse gespeichert sind und welches ich auch als Eingabe für die Klassifizierungspipeline nutze
- Stabile Ids für Elemente im Businessprozess sind essenziell, damit die Ausgabe des LLM immer auf die gleichen Aktivitäten bezieht und man das Ergebnis deterministisch überprüfen kann

### 2.3 LLMs

- Prompting (System Message, User Prompt)
- Zero-/Few-Shot
- JSON Konforme Ausgaben
- typische Fehlerbilder (Halluzination, ungültiges JSON) + Gegenmaßnahmen
- Finetuning (?) Auch wenn ich es nicht nutze ?

### 2.4 Verwandte Arbeiten

- Was für Ansätze gibt es bereits Prozesse automatisiert nach datenschutzkritischen Aktivitäten klassifizieren zu lassen
- LLMs zum Klassifizieren nutzen
- Prompt Engineering (Zero-Shot)
- Überblick über LLMs in Businessprozessen. Was gibt es bereits für Ansätze diese zu benutzen
- Benchmarking und Evaluierung von LLMs
- Identifizierte Forschungslücken: LLMs zur Klassifizierung, EU-Fokus, einheitliche reproduzierbare Benchmarks

## 3. Problemdefinition und Zielkriterien

### 3.1 Aufgabenstellung

- Eingabe ist BPMN-XML; Ausgabe ist eine Menge von Aktivitäts-IDs, die als kritisch klassifiziert worden sind. Optional auch mit Erklärung vom LLM warum, es sich so entschieden hat
- Definition was als kritisch zu klassifizieren ist: Eine Aktivität ist kritisch, wenn sie personenbezogene Daten verarbeitet (Hier nochmal genauer definieren nach DSGVO), einschließlich Nutzung bereits vorhandener Daten.

### 3.2 Qualitätsziele

// TODO Hier prüfen, ob ich das so schon hier sagen kann oder das erst bei der Diskussion thematisiert werden soll, dass mir der hohe Recall eher positiv aufgefallen ist, weil es des öfteren plausible Erklärungen dazu gab
- Hauptziel ist ein hoher Recall mit minimalen False Negatives, bei noch akzeptabler Precision und somit auch überschaubaren False Positives
// TODO Aktuell unterstützt meine Evaluierung noch keine Seeds, aber das sollte ich noch umsetzen können und dann temperature bei den LLMs auf 0 setzen
- Sekundäres Ziel ist Stabilität über mehrere Seeds hinweg
- Hier könnte ich noch bestimmte Wertebereiche vorschlagen, sie sinnvoll wären wie Recall >=80%, False positives <= 1,5/Prozess. Unbedingt dafür noch in anderen Papern nach guten Werden schauen, wenn ich das machen sollte

### 3.3 Scope und Annahmen

- Sprachen sind DE und EN
- Keine Bewertung der Rechtmäßigkeit an sich, sondern nur ein Screening nach kritischen Aktivitäten (Wie ein Vorfilter)
- Risiken und Grenzen (Bspw. schlechte Einschätzung des LLM wenn Artefakte wie Datenobjekte im BPMN Modell fehlen) werden transparent gemacht

## 4. Klassifizierungsalgorithmus (Design und Implementierung)

- Im gesamten Kapitel werden die genutzten Technologien an geeigneter Stelle aufgezeigt und beschrieben (Camunda-BPMN, Langchain4j, Springboot, Kotlin, ...)
  - TODO: Ggf. extra Unterkapitel für die genutzten Technologien oder doch immer da erwähnen wo es gerade passt

### 4.1 Ziel und Annahmen

- Eingabe ist BPMN XML, Ausgabe sind die IDs der kritischen Aktivitäten mit ggf. Erklärung
- Getestet wird mit BPMN Modellen aus Camunda und bpmn.io
- Der Algorithmus klassifiziert Aktivitäten in BPMN Prozessen binär nach "kritisch" oder "nicht kritisch"
- Ausgegeben werden ausschließlich die IDs der kritischen Aktivitäten ggf. mit Erklärung, warum Sie als kritisch klassifiziert wurde
- Das Ziel ist ein robustes und reproduzierbares Verhalten über unterschiedliche Modelle
  - Granularität der Prozesse (Bpsw. >5 Aktivitäten, 20+ Aktitväten)
  - Gateways, Datenobjekte, Datenbanken
  - Mehrere Pools/Lanes, Message Flows
  - Evtl (?) Verschiedene Sprachen, Text Annotationen

### 4.2 BPMN Preprocessing

- BPMN XML wird geparsed
- Relationen von Flow Elementen zu anderen Elementen werden extrahiert:
```kotlin
data class BpmnElement(
    val type: String,
    val id: String,
    val documentation: String? = null,
    val name: String? = null,
    val outgoingFlowElementIds: List<String> = emptyList(),
    val incomingFlowElementIds: List<String> = emptyList(),
    val incomingDataFromElementIds: List<String> = emptyList(),
    val outgoingDataToElementIds: List<String> = emptyList(),
    val associatedElementIds: List<String> = emptyList()
)
```
- Dadurch entsteht für jedes Element ein strukturierter Kontext (id, name, pool, lane, eingehende Elemente, ...)
- Dieser Kontext wird später im prompt genutzt, um dem LLM alle notwendigen Informationen strukturiert bereit zu stellen

### 4.3 Prompt Engineering

- Referenz auf Zero-Shot/Few-Shot (?)
- Prompt Sprache (Passendes Paper referenzieren)
- Erklärung des System Prompt (Anleitung was als kritisch klassifiziert werden soll, Auflistung wichtiger DSGVO kritischer Inhalte und Definitionen aus der DSGVO wie "Verarbeitung", Definition des Ausgabeformats mit Langchain4j)
- Was steht im User Prompt drin

### 4.4 Validierung der Ausgabe

- Ausgabeschema wird in Langchain4j deklarativ beschrieben
- Erklären was Langchain4j im Hintergrund tut, damit das Schema eingehalten wird und die Ausgabe das korrekte Format hat
```kotlin
data class AnalysisResponse(
    val criticalElements: List<CriticalElement>
) {
    data class CriticalElement(
        val id: String,
        val name: String?,
        val reason: String
    )
}
``` 
- Abgleichen der ausgegebenen IDs mit den vorhandenen aus dem Prozess. Ggf. unzulässige entfernen

// TODO Entscheiden, ob ich hier noch Ablationen brauche (Falls ja hier noch ein Kapitel darüber einbauen) wie eine Baseline ohne zusätzliches Prompt Engineering, Varianten wo beim Preprocessing Lanes und Pools, Datenobjekte etc. weggelassen werden

### 4.5 HTTP Schnittstelle

- Klassifizierungspipeline ist über HTTP Endpunk aufrufbar, wo das BPMN XML und ggf. Attribute zum Überschreiben des genutzten LLMs übergeben werden
- Klassifizierungspipeline kann außerdem lokal über CLI gestartet werden und legt Ergebnisse in Datei ab
- Dadurch kann die Klassifizierung leicht in das Evaluationsframework eingebunden werden, während das Evaluationsframework flexibel bleibt und beliebige Klassifizierungsalgorithmen benutzten kann, welche ebenfalls die gleiche HTTP Schnittstelle anbieten
- Beispielaufruf des Klassifierungsendpunkts
- Irgendwo hier oder auch in einem nächsten Abschnitt die "Schnittstelle" mit bpmnXML rein und JSON mit liste der kritischen Elemente (Evtl. mit Begründung) wieder. Durch diese vereinheitlichung ist es möglich verschiedene Algorithmen in dem Evaluationsframework zu vergleichen (Stichwort Standardisierung). Vielleicht gehe ich auch soweit, dass ich den Standard für zukünftige Arbeiten propose, damit spätere Arbeiten meinen Standard zum Vergleich nutzen können

### 4.6 Nutzung über Frontend

- Die Klassifizierung kann über eine Sandbox im Frontend genutzt werden. Dort können auch die LLM Parameter angepasst werden, um andere Modelle testen zu können
- Sandbox ist ein voller BPMN Editor basierend auf BPMN.js und bietet zusätzlich die Funktionalität zur Klassifizierung an
- Als kritisch klassifizierte Elemente werden im Editor farblich hervorgehoben

## 5. Evaluationsframework 

### 5.1 Anforderungen und Use-Cases

- Das Framework ermöglicht einen Vergleich von Modellen (Austauschbar durch LlmPropsOverride) und Algorithmen (Austauschbar über Http Endpunkt) auf Basis von gelabelten Testdaten
- Evaluations Run über YAML Konfigurierbar (Modelle, Endpunkte, Testdaten)
- Detaillierter Ausgabe der Ergebnisse
  - Side-by-side Diagramme von Accuracy, Precision, Recall und F1-Score sowie FP, FN, TP, TN und generell wie viele Testcases erfolgreich waren
  - Detailliertere Ansicht nochmal pro Modell und dafür nochmal pro Testcase
- Zielnutzer sind Forschende und Entwickler die Modelle und Algorithmen auswerten und ggf. untereinander vergleichen wollen
- Frontend zur einfachen Bedienung

### 5.2 Architektur und Komponenten

- Diagramm zur Architektur erstellen
- HTTP Endpunkt oder CLI zum starten -> Holen der notwendigen Testdatensätze -> Aufruf der Klassifizierung pro Modell und pro Testcase -> Akkumulieren der Ergebnisse pro Testcase + Gff. frühzeitige Rückgabe des Ergebnisses des Testcase für Live Ansicht in UI -> Aufarbeiten der akkumulierten Ergebnisse und berechnen wichtiger Metriken
- EvaluationController, MultiEvaluationRunner, EvaluationRunner, HttpEvaluator, MetricsAccumulator, Ggf. Frontend (Concurrency von MultiEvaluationRunner)

### 5.3 Konfiguration einer Evaluierung

- Evaluierung kann mit einer YAML Datei konfiguriert werden
```yaml
defaultEvaluationEndpoint: /gdpr/analysis/prompt-engineering
maxConcurrent: 10
models:
  - label: Mistral Medium 3.1
    llmProps:
      baseUrl: https://openrouter.ai/api/v1
      modelName: mistralai/mistral-medium-3.1
      apiKey: ${OPEN_ROUTER_API_KEY}
  - label: Deepseek Chat v3.1
    llmProps:
      baseUrl: https://openrouter.ai/api/v1
      modelName: deepseek/deepseek-chat-v3.1
      apiKey: ${OPEN_ROUTER_API_KEY}
  - label: GPT oss 120b
    llmProps:
      baseUrl: https://openrouter.ai/api/v1
      modelName: openai/gpt-oss-120b
      apiKey: ${OPEN_ROUTER_API_KEY}
datasets:
  - 2
  - 7
```
- Secrets können entweder im Klartext angegeben werden oder sicher mit ${...} referenziert werden, wenn sie im Backend als Umgebungsvariable hinterlegt sind

### 5.4 Testdaten

- Die Testdaten werden aus einer Datenbank ausgelesen
- In der Konfig kann konfiguriert werden welche Testdaten genutzt werden sollen
- Die Testdaten können direkt in der App erstellt, verwaltet und gelabelt werden
- (Kapitel 6 wird sich um die Labelingsoftware drehen)

### 5.5 Generierte Resultate

- Für jeden Testfall werden pro Modell Ergebnisse gesammelt (klassifizierte Aktivitäten mit Erklärung, TP/FP/FN/TN, Bild-URL mit farblich hervorgehobenen Aktivitäten, bestanden oder nicht bestanden)
- Pro Modell werden "Summary-Objekte" erstellt mit jeweils Precision, Accuracy, Recall, F1-Score, Confusion (TP/FP/FN/TN), Anzahl korrekter Testfälle, Anzahl falsch klassifizierter Testfälle und Anzahl Testfälle in denen es zu Problemen kam (Bspw. Parsing Fehler, Token Limit überschritten, ...)
- Generelle Metadaten über die genutzten Modelle, Endpunkte zur Klassifizierung und Testdatensätze, sowie Zeitstempel (und seed????)

### 5.6 Visualisierung im Frontend

- Detaillierter Ausgabe der Ergebnisse
  - Side-by-side Diagramme von Accuracy, Precision, Recall und F1-Score sowie FP, FN, TP, TN und generell wie viele Testcases erfolgreich waren
  - Detailliertere Ansicht nochmal pro Modell und dafür nochmal pro Testcase
- Hier auch ruhig Bilder vom Frontend einbauen
- Die Ergebnisse können als JSON exportiert und wieder importiert werden und als Markdown Report exportiert werden

### 5.7 Erweiterbarkeit

- Neue Modelle können über Konfiguration ergänzt werden (Endpunkt, Modellname, API Key)
- Neue Klassifizierungsalgorithmen/pipelines können ergänzt werden, wenn sie das vorgegebene HTTP Schnittstelle unterstützen
- Die Testdatensätze werden aus Datenbank ausgelesen und können für jeden Evaluations run neu gesetzt werden

## 6. Labelingsoftware

Hier brauche noch genaue Kapitel, aber hier soll auf jeden Fall folgendes rein:
- Definition von Labeln hier, oder kommt das schon vorher?
- Labeling Software wurde entwickelt
- Es können Datensätze mit Namen und Beschreibungen erstellt werden
- Für jeden Datensatz können beliebig viele Testcases erstellt werden
- Ein Testcase ist ein BPMN Diagramm, welches direkt in der App mithilfe von bpmn.io bearbeitet werden kann
- Zusätzlich bietet der Editor eine Labeling Funktionalität, mit welcher Aktivitäten, welche als kritisch erkannt werden sollen, gelabelt werden. Zusätzlich kann auch eine Erklärung angegeben werden
- Datensätze und gelabelte Testcases werden in Datenbank gespeichert und werden während der Evaluierung des Evaluationsframeworks benutzt

## 7. Erstellung der Datensätze

### 7.1 Quellen und Eigenschaften 

- Es werden drei unterschiedliche Datensätze genutzt
  - Von der Uni bekommen
  - Mittelgroße realistische Prozesse aus unterschiedlichen Branchen (Mit Pools, Lanes, Datenobjekten, Gateways, ...)
  - Kleine Prozesse mit maximal 5 Aktivitäten und keinen weiteren Elementen
- Eventuell tabellarische Aufzählung von Eckdaten zu jedem Datensatz (Anzahl Elemente, Sprache, benutzte Elemente)
- Hier sollte ich glaub ich noch besser erklären warum die Auswahl heterogen ist (und damit möglichst aussagekräftige Ergebnisse in der Evaluierung erzeugen)
- Eventuell (im Anhang) eine Liste aller Testfälle jeweils auch mit den Eckdaten und auf diese verweisen. Da kann dann auch immer noch eine kurze Beschreibung dazu was daran besonders ist

### 7.2 Labeling-Guide

- Eine Aktivität ist als kritisch gelabelt, wenn sie personenbezogene Daten erhebt, nutzt, speichert, übermittelt oder löscht oder anderweitig explizit eine DSGVO Pflicht auslöst (Auskunft, Löschung) (Hier auch die Kriterien von der originalen DSGVO einbinden und daran Ableiten, wie man labeln soll)
- Beispiele einbauen, was als kritisch gelabelt wurde und Gegenbeispiele aufzeigen, damit Grenzfälle klar definiert sind

## 8. Modellauswahl

### 8.1 Kriterien

- Ab wann gilt ein Modell als EU Modell, entsprechend umgekehrt: Ab wann ist Modell international 
  - Sitz in EU
  - Training/Finetuning in EU
  - Veröffentlicht in EU
- Was bedeutet Open Source
  - Frei verfügbare Gewichte
  - Permissive Lizenz
- Größenklassen (Bspw. <8B, 8-20B, ...)
- Letztes Update
- Downloads
- Lizens
- Kontext (Wichtig auch für die Größe der Prozesse, die damit verarbeitet werden können. Irgendwo muss ich das auch nochmal thematisieren)

### 8.2 Modellvorstellung

- Tabellarische Auflistung der Modelle
- Begründung warum genau die Modelle ausgewählt worden sind

## 9. Versuchsaufbau

Ich habe noch nicht die Unterkapitel (außer Metriken) aber folgendes soll hier u.a. rein:

- Die Modelle werden jeweils mit dem gleichen Klassifizierungsalgorithmus und den gleichen Datensätzen benutzt
- Die Evaluierung wird jeweils für jeden vorhandenen Testdatensatz durchgeführt (Uni, reale größere Prozesse, kleine Prozesse)
- Die Evaluationen werden pro Konfiguration (Modelle, Datensätze) mehrfach durchgeführt (Unterschiedliche Seeds, falls ich bis dahin Seeds unterstütze)
- Es werden verschiedene LLM-Modelle vergleichen
- Es werden vom gleichen LLM-Modell die unterschiedlichen Größen verglichen
- ...
- Ein Tetcase gilt als korrekt klassifiziert, wenn genau die als kritisch gelabelten Aktivitäten als kritisch klassifiziert worden sind. Sobald es False Positives oder False Negatives gibt, ist ein Testcase nciht korrekt klassifiziert worden

### Metriken

(Dopplung mit 5.5. ist das Schlimm?)
- Für jeden Testfall werden pro Modell Ergebnisse gesammelt (klassifizierte Aktivitäten mit Erklärung, TP/FP/FN/TN, Bild-URL mit farblich hervorgehobenen Aktivitäten, bestanden oder nicht bestanden)
- Pro Modell werden "Summary-Objekte" erstellt mit jeweils Precision, Accuracy, Recall, F1-Score, Confusion (TP/FP/FN/TN), Anzahl korrekter Testfälle, Anzahl falsch klassifizierter Testfälle und Anzahl Testfälle in denen es zu Problemen kam (Bspw. Parsing Fehler, Token Limit überschritten, ...)

## 10. Durchführung

### 10.1 Experimente

- Dokumentation der einzelnen Runs
  - Konfiguration aufzeigen
  - Diagramme der Ergebnisse

### 10.2 Fehlerklassen

- Falls es Fehlerklassen gibt kann ich sie hier thematisieren (Timeout, Parse-Error, Token Limit, ...)

## 11. Ergebnisse

### 11.1 Gesamtübersicht

- Hier allgemein die Ergebnisse der einzelnen Runs darstellen (Vor allem die Diagramme wo die einzelnen metriken nebeneinander aufgelistet sind)

### 11.2 Analyse

- Aufschlüsselung nach Datensätzen
- Aufzeigen sichtbarer Muster

### 11.3 Antworten auf Forschungsfragen

- Hier werden die unteren Forschungsfragen mithilfe der Evaluationsergebnisse beantwortet
- EU vs. International
- Groß vs. Klein
- Bestes Open Source Modell
- Open Source vs. Kommerziell

### 11.4 Fallstudien

- Hier werde ich (wahrscheinlich 2-3) spezifische exemplarische Ergebnisse von Testcases heraussuchen und genauer unter die Lupe nehmen. Was ist hier besonders aufgefallen oder Interessant?
- Hier kann ich die Bilder mit den highlights hernehmen

### 11.5 Robustheit

- Varianz über mehrere Runs untersuchen (Unterschiedliche Seeds, falls ich bis dahin welche unterstütze)
- Ggf. weitere Metriken hier interessant
- Wie Fehleranfällig sit die Klassifizierung

## 12. Diskussion

### 12.1 Interpretation der Befunde

- Einordnung der Rangfolge der LLMs
- Besonderheiten der Modellfamilien (Bspw. wie groß ist der Unterschied von Groß gegen Klein?)
- Es gab Prozesse in denen ich eine Aktivität nicht als kritisch gelabelt habe, aber das LLM in der Evaluierung das als kritisch mit einer validen Begründung klassifiziert hat, man könnte die Testdaten also noch anpassen, wenn die Begürundung des LLMs überzeugt (Ich weiß nicht wie sinnvoll das ist hier zu thematisieren)

### 12.2 Hoher Recall vs. Prezision

- Beobachtung ausformulieren, dass einige Testfälle als fehlerhaft eingeordnet wurden, weil es False-Positives gab, obwohl es keine False-Negatives gab. Es wurden also alle Aktivitäten gefunden, die gefunden werden sollten, nur halt noch mehr on top.
- Einordnung der FP-Last pro Prozess (Lieber False Positives, als dass etwas übersehen wird, Ziel war sowieso ein Vorscreening), Diskussion darüber wie nützlich hohe Recall Werte sind

### 12.3 EU-Modelle

- Analyse der EU-Open-Source Modelle in Bezug auf Precision, Recall und Stabilität in bezug auf die anderen Modelle
- Wie gut haben sich die EU Modelle im vergleich zu den anderen geschlagen

### 12.4 Open-Source Modelle

- Analyse der Open-Source Modelle in bezug auf Precision, Recall und Stabilität in bezug auf kommerzielle Modelle
- Wie gut haben sich die Open-Source Modelle im Vergleich zu den anderen geschlagen

### 12.5 Modellgrößen

- Selbst hosten von Modellen diskutieren. Ist es realistisch die Modelle selbst zu hosten, welche gut performt haben? Reichen die kleinen Varianten der Modelle oder muss man schon die großen Modelle benutzen, um gute Ergebnisse zu erzielen

### 12.6 Grenzen

- Wären Grenzen wie BPMN-Modell Größe im Zusammenhang mit der Kontextlänge des LLM interessant?
- Keine Aussagekräftige Rechtsberatung, sondern stand jetzt eher ein Vorscreening, was nochmal überprüft werden muss

## 13. Zusammenfassung

Hier neben der allgemeinen Zusammenfassung unbedingt noch die erste Forschungsfrage explizit beantworten

## 14. Aussicht

Unter anderem das hier, evtl noch mehr:
- Jetzt gibt es ein einheitliches Evaluationsframework mit einer einheitlich definierten Schnittstelle für Klassifizierungsalgorithmen -> Zukünftige Arbeiten können sich mit der Entwicklung besserer Klassifizierungsalgorithmen/Pipelines (Bspw. noch RAG einbauen) beschäftigen und diese mit diesem Framework vergleichen/benchmarken
- Außerdem können in Zukunft auch noch mehr Modelle vergleichen werden, da sich die Welt der LLMs rasant weiterentwickelt
- Auch Finetunen ist etwas was interessant gewesen wäre für diese Masterarbeit, aber den Rahmen gesprengt hätte



