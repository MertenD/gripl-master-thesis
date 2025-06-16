## Test Case 1
**Input:** `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1">
      <bpmn:outgoing>Flow_06mayqc</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Activity_0zqrwn8" name="Kunden anrufen">
      <bpmn:incoming>Flow_06mayqc</bpmn:incoming>
      <bpmn:outgoing>Flow_1hfb1h1</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_06mayqc" sourceRef="StartEvent_1" targetRef="Activity_0zqrwn8" />
    <bpmn:endEvent id="Event_1r7pl3x">
      <bpmn:incoming>Flow_1hfb1h1</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1hfb1h1" sourceRef="Activity_0zqrwn8" targetRef="Event_1r7pl3x" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="173" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0zqrwn8_di" bpmnElement="Activity_0zqrwn8">
        <dc:Bounds x="260" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1r7pl3x_di" bpmnElement="Event_1r7pl3x">
        <dc:Bounds x="412" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_06mayqc_di" bpmnElement="Flow_06mayqc">
        <di:waypoint x="209" y="120" />
        <di:waypoint x="260" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1hfb1h1_di" bpmnElement="Flow_1hfb1h1">
        <di:waypoint x="360" y="120" />
        <di:waypoint x="412" y="120" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`
**Expected:** Activity_0zqrwn8
**Actual:** Activity_0zqrwn8
**Result:** ✅ Passed

## Test Case 2
**Input:** `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1">
      <bpmn:outgoing>Flow_0fcw012</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Activity_0vdpsz1" name="Persönliche Daten sammeln">
      <bpmn:incoming>Flow_0fcw012</bpmn:incoming>
      <bpmn:outgoing>Flow_1nrmqgv</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_0fcw012" sourceRef="StartEvent_1" targetRef="Activity_0vdpsz1" />
    <bpmn:task id="Activity_1ki70dr" name="Nachricht senden">
      <bpmn:incoming>Flow_1nrmqgv</bpmn:incoming>
      <bpmn:outgoing>Flow_1fqgpoh</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_1nrmqgv" sourceRef="Activity_0vdpsz1" targetRef="Activity_1ki70dr" />
    <bpmn:endEvent id="Event_112jzsz">
      <bpmn:incoming>Flow_1fqgpoh</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1fqgpoh" sourceRef="Activity_1ki70dr" targetRef="Event_112jzsz" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="173" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0vdpsz1_di" bpmnElement="Activity_0vdpsz1">
        <dc:Bounds x="260" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1ki70dr_di" bpmnElement="Activity_1ki70dr">
        <dc:Bounds x="420" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_112jzsz_di" bpmnElement="Event_112jzsz">
        <dc:Bounds x="582" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_0fcw012_di" bpmnElement="Flow_0fcw012">
        <di:waypoint x="209" y="120" />
        <di:waypoint x="260" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1nrmqgv_di" bpmnElement="Flow_1nrmqgv">
        <di:waypoint x="360" y="120" />
        <di:waypoint x="420" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1fqgpoh_di" bpmnElement="Flow_1fqgpoh">
        <di:waypoint x="520" y="120" />
        <di:waypoint x="582" y="120" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`
**Expected:** Activity_0vdpsz1
**Actual:** Activity_0vdpsz1
**Result:** ✅ Passed

## Test Case 3
**Input:** `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1">
      <bpmn:outgoing>Flow_0fcw012</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Activity_0vdpsz1" name="Identität des Kunden bestätigen">
      <bpmn:incoming>Flow_0fcw012</bpmn:incoming>
      <bpmn:outgoing>Flow_1nrmqgv</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_0fcw012" sourceRef="StartEvent_1" targetRef="Activity_0vdpsz1" />
    <bpmn:task id="Activity_1ki70dr" name="Statistiken berechnen">
      <bpmn:incoming>Flow_1nrmqgv</bpmn:incoming>
      <bpmn:outgoing>Flow_0jz0tcq</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_1nrmqgv" sourceRef="Activity_0vdpsz1" targetRef="Activity_1ki70dr" />
    <bpmn:endEvent id="Event_112jzsz">
      <bpmn:incoming>Flow_0hbx4sh</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:task id="Activity_1dttfxu" name="Invoice erstellen">
      <bpmn:incoming>Flow_0jz0tcq</bpmn:incoming>
      <bpmn:outgoing>Flow_0hbx4sh</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_0jz0tcq" sourceRef="Activity_1ki70dr" targetRef="Activity_1dttfxu" />
    <bpmn:sequenceFlow id="Flow_0hbx4sh" sourceRef="Activity_1dttfxu" targetRef="Event_112jzsz" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="173" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0vdpsz1_di" bpmnElement="Activity_0vdpsz1">
        <dc:Bounds x="260" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1ki70dr_di" bpmnElement="Activity_1ki70dr">
        <dc:Bounds x="420" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1dttfxu_di" bpmnElement="Activity_1dttfxu">
        <dc:Bounds x="580" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_112jzsz_di" bpmnElement="Event_112jzsz">
        <dc:Bounds x="742" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_0fcw012_di" bpmnElement="Flow_0fcw012">
        <di:waypoint x="209" y="120" />
        <di:waypoint x="260" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1nrmqgv_di" bpmnElement="Flow_1nrmqgv">
        <di:waypoint x="360" y="120" />
        <di:waypoint x="420" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0jz0tcq_di" bpmnElement="Flow_0jz0tcq">
        <di:waypoint x="520" y="120" />
        <di:waypoint x="580" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0hbx4sh_di" bpmnElement="Flow_0hbx4sh">
        <di:waypoint x="680" y="120" />
        <di:waypoint x="742" y="120" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`
**Expected:** Activity_0vdpsz1, Activity_1dttfxu
**Actual:** Activity_1dttfxu
**Result:** ❌ Failed

## Summary
Total: 3
Passed: 2
Failed: 1
