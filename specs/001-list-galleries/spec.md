# Spec 001: List galleries

Status: REVIEWED

## Problem
A photographer wants to see her galleries.

## Scope
In scope: listing galleries through the API.
Out of scope: creating, editing, publishing, photos, login, any user interface.

## Data
A gallery has a name, belongs to a photographer, and is either a draft or published.
On first start, if there are no galleries, create three:
"Levi wedding" and "Cohen bar mitzvah" belonging to dana, and "Tel Aviv portraits" belonging to noa.

## Requirements
FR-1: The system shall provide `GET /api/galleries`, returning the galleries as JSON.

## Assumptions
A-1: The current user is identified by the `X-User-Id` request header. Each gallery belongs to a photographer, so the API returns only galleries whose photographer matches the current user. When the header is absent or the user has no galleries, the response is an empty list.

## Acceptance criteria
AC-1 (list galleries)
- Given galleries exist
- When the photographer requests the list
- Then the response status is 200 and the JSON contains only the galleries belonging to that photographer
- And no gallery owned by another photographer is included

AC-2: dana gets only her own galleries
- Given dana has galleries in the system
- When she requests the list with `X-User-Id: dana`
- Then the response status is 200 and the JSON contains exactly the galleries for dana
- And no gallery belonging to another photographer is included

AC-3: request without identity
- Given the request does not include `X-User-Id`
- When a photographer requests the list
- Then the response status is 200 and the JSON body is `[]`
- And no galleries are returned

AC-4: unknown user
- Given the request includes `X-User-Id: rina` and no galleries belong to rina
- When the photographer requests the list
- Then the response status is 200 and the JSON body is `[]`
- And no error is returned

AC-5: restart
- Given the server has been restarted and the database is empty
- When dana requests the list with `X-User-Id: dana`
- Then the response status is 200 and the JSON contains the seeded dana galleries again
- And the seeded data is recreated on first startup

<!-- Session 4: the pair adds AC-2 onward below this line, by hand, before any fix. -->
