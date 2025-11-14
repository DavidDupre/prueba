function sortUsers(array) {
  return array.sort((a, b) => {
    let nameA = a.firstname.toUpperCase();
    let nameB = b.firstname.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}

export default sortUsers;
