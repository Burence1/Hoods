export class Snapshot {
  snapshotToArray = (snapshot: any) => {
    const returnArr: any[] = [];

    snapshot.forEach((childSnapshot: any) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
    });

    return returnArr;
}}
