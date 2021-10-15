interface keyable {
    [key: string]: any  
}

// objects are returned with a __typename property, even
// when this isn't requested. this is a known issue and something that
// apparently is harder to deal with than one might initially expect,
// unless one wants to break caching and fragment-related functionality.
// https://github.com/apollographql/apollo-client/issues/1913
// this function shallowly strips objects of the __typename property
function shallowStripTypename(obj: keyable) {
    const clone = { ...obj };

    if (clone.__typename) {
        delete clone.__typename;
    }
    return clone;
}

function isAnObject(arg: any) {
    if (
        typeof arg === 'object' &&
        !Array.isArray(arg) &&
        arg !== null
    ) {
        return true;
    }
    return false;
}

function isAnArray(arg: any) {
    if (
        typeof arg === 'object' &&
        Array.isArray(arg)
    ) {
        return true;
    }
    return false;
}

export function stripTypename(obj: keyable) {
    const clone = { ...obj };

    for (let key in clone) {
        if (isAnObject(clone[key])) {
            clone[key] = stripTypename(clone[key]);
        } else if (isAnArray(clone[key])) {
            const cloneArr = [ ...clone[key] ];
            for (let arrI in cloneArr) {
                cloneArr[arrI] = stripTypename(cloneArr[arrI]);
            }

            clone[key] = cloneArr;
        }
    }
    return shallowStripTypename(clone)
}
