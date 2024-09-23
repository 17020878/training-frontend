
function sosanh(tree, key1, key2) {
    function sosanh2(node, key2) {
        if (node.key == key2) {
            return true;
        } else {
            if (node.children) {
                for (let childNode of node.children) {
                    if( sosanh2(childNode, key2)){
                        return true;
                    }
                }
            }
        }
        return false;
    }

        if (tree.key == key1) {
            if (tree.children) {
                for (let node of tree.children) {
                    if(sosanh2(node, key2)){
                        return true;
                    }
                }
            }
        } else {
            if (tree.children) {
                for (let node of tree.children) {
                    if (sosanh(node, key1, key2)) {
                        return true;
                    }
                }
            }
        }
    return false;
}

const tree = {
    key: 0,
    children: [
        {
            key: 1,
            children: [
                {
                    key: 2, children: [{key: 8}]
                },
                {
                    key: 3,
                },
            ],
        },
        {
            key: 4,
        },
        {
            key: 5,
        },
    ],
};

let listKey = [1, 2, 3, 4, 5, 8,0]
let listDel = []
for (let i = 0; i < listKey.length; i++) {
    if (!listDel.includes(listKey[i])){
        for (let j = 0; j < listKey.length; j++) {
            if (!listDel.includes(listKey[j])){
                if (i != j) {
                    if (sosanh(tree, listKey[i], listKey[j])) {
                        listDel.push(listKey[j])
                    }
                }
            }

        }
    }

}

