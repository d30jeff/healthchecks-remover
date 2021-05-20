# Healthchecks Remover

Check remover for [https://healthchecks.io/](https://healthchecks.io/)

## Installing dependencies

`yarn`

## Running the command

`API_KEY=<YOUR_API_KEY> node main.js`

## Modification

Please modify the callback filter function on `line 11` to set your condition,
by default it removes the checks that have not been pinged or checks that are older
than 4 weeks

```
const filterFunction = (item) => {
  const neverPinged = item.last_ping === null;
  const olderThan4Weeks = dayjs().diff(dayjs(item.last_ping), 'weeks') > 4;

  return neverPinged || olderThan4Weeks;
}
```
