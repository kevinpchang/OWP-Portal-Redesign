// Runs unit tests for the Operator Numbers Page
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npm run test:front -- src/__tests__/OperatorNumbersUnitTest.spec.js
// To run with coverage: npm run test:front -- src/__tests__/OperatorNumbersUnitTest.spec.js --coverage
// To run all frontend tests: npm run test:front

import { describe, it, expect } from 'vitest'


//Unit test to get all certificates for user
function getTranscriptItems(enrollments) {
    const transcriptRows = enrollments.filter(
        (r) => r.statustxt === 'Complete' && (String(r.grade ?? "").trim() === "CR" || String(r.grade ?? "").trim() === "A" || String(r.grade ?? "").trim() === "B" || String(r.grade ?? "").trim() === "C")
    )

    return transcriptRows.map((r) => ({
        key: r.enrollid,
        title: r.title || 'Course title unavailable',
        routeTo: '/Certificates',
    }))
}

describe('get Certificates', () => {
    it('returns only Complete enrollments with grade "CR", "A", "B", or "C"', () => {
        const enrollments = [
            { enrollid: 1, title: 'Course A', statustxt: 'Enrolled', grade: 'B' },
            { enrollid: 2, title: 'Course B', statustxt: 'Complete', grade: 'A' },
            { enrollid: 3, title: 'Course C', statustxt: 'Dropped', grade: null },
            { enrollid: 4, title: 'Course D', statustxt: 'Complete', grade: 'CR' },
        ]

        expect(getTranscriptItems(enrollments)).toEqual([
            { key: 2, title: 'Course B', routeTo: '/Certificates' },
            { key: 4, title: 'Course D', routeTo: '/Certificates' },
        ])
    })
})

//Unit test to generaete Update Operator Number payload
function updateNumber(original) {

    const editOpNum = '12345';
    const editState = 'CO';

    if (!original) return

    const payload = {
        oprlicid: original.oprlicid,
        liccatid: original.liccatid,
        countryid: original.countryid,
        status: original.oprlicstatus,
        operatornumber: editOpNum,
        state: editState,
        ip: "localhost"
    }

    return payload
}

describe('update number', () => {
    it('returns the correct payload for a valid original', () => {
        const original = {
            oprlicid: 84910,
            personid: 458860,
            oprlicstatus: "A",
            operatornumber: "12345",
            secondaryidnumber: null,
            effectdate: null,
            expiredate: null,
            countryid: 1,
            country: "United States of America",
            stateid: "CA",
            state: "California",
            liccatid: 1,
            liccattxt: "Operator",
            nearexpire: "0",
            expired: "0",
            expiredflag: "0",
            archivedflag: "0",
            archiveddate: null,
            insdate: "Feb 19, 2026",
            renewaleligibledate: null
        };


        expect(updateNumber(original)).toEqual({
            oprlicid: 84910,
            liccatid: 1,
            countryid: 1,
            status: 'A',
            operatornumber: '12345',
            state: 'CO',
            ip: "localhost"
        });
    });
});

//Unit test to ensure delete number deletes the correct number
function deleteNumber(original) {

    const editOpNum = '12345';
    const editState = 'CO';

    if (!original) return

    const payload = {
        oprlicid: original.oprlicid,
        personid: original.personid,
        ip: "localhost"
    }

    return payload
}

describe('delete number', () => {
    it('deletes correct number based on oprlicid', () => {
        const original = {
            oprlicid: 84910,
            personid: 458860,
            oprlicstatus: "A",
            operatornumber: "12345",
            secondaryidnumber: null,
            effectdate: null,
            expiredate: null,
            countryid: 1,
            country: "United States of America",
            stateid: "CA",
            state: "California",
            liccatid: 1,
            liccattxt: "Operator",
            nearexpire: "0",
            expired: "0",
            expiredflag: "0",
            archivedflag: "0",
            archiveddate: null,
            insdate: "Feb 19, 2026",
            renewaleligibledate: null
        };


        expect(deleteNumber(original)).toEqual({
            ip: "localhost", 
            oprlicid: 84910,
            personid: 458860
        });
    });
});

//Unit test to ensure add number generates correct payload
function addNumber() {

    const addOpNum = '12345';
    const addState = 'CO';


    const payload = {
        liccatid: 1,
        countryid: 1,
        status: "A",
        operatornumber: addOpNum,
        state: addState,
        ipAddr: "localhost"
    }

    return payload
}

describe('add number', () => {
    it('generates correct payload for adding a new number', () => {

        expect(addNumber()).toEqual({
            liccatid: 1,
            countryid: 1,
            status: "A",
            operatornumber: '12345',
            state: 'CO',
            ipAddr: "localhost"
        });
    });
});