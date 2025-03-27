/// <mls shortName="wcdGlobal" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * Finds the closest parent element of a specified element with a specific `tagName`.
 * The function accounts for `shadow roots` and traverses up the DOM tree to find the desired element
 * or until the top of the DOM is reached.
 *
 * @param element - The element from which the search should start. Must be of type `Element`.
 * @param tagName - The tag name that the parent element should have. This should be a string representing the tag name,
 *                   case-insensitive (e.g., 'DIV', 'SPAN').
 * @returns The first parent element that matches the specified `tagName`. If no matching parent element is found
 *          up to the top of the DOM tree, it returns `null`.
 *
 * @example
 * ```typescript
 * const targetElement = document.querySelector('some-element')!;
 * const parentElement = findParentElementWithTagName(targetElement, 'div');
 *
 * if (parentElement) {
 *     console.log('Parent element found:', parentElement);
 * } else {
 *     console.log('No parent element with the specified tag name found.');
 * }
 * ```
 */
export function findParentElementWithTagName(
    element: Element,
    tagName: string
): Element | null {
    tagName = tagName.toUpperCase();

    let currentElement: Element | null = element;

    while (currentElement) {
        if (currentElement.tagName === tagName) {
            return currentElement;
        }

        const parentNode: ParentNode | null = currentElement.parentNode;

        if (parentNode instanceof ShadowRoot) {
            currentElement = parentNode.host;
        } else if (parentNode) {
            currentElement = parentNode as Element;
        } else {
            currentElement = null;
        }
    }

    return null;
}

/**
 * Retrieves all sibling elements that come after a specified element in the DOM.
 *
 * This function collects all siblings of the given element that appear after it in the DOM order.
 * It starts from the immediate next sibling and continues until there are no more siblings.
 *
 * @param element - The HTML element whose siblings after it are to be retrieved. Must be of type `HTMLElement`.
 * @returns An array of `HTMLElement` objects representing the siblings that come after the specified element.
 *
 * @example
 * ```typescript
 * const targetElement = document.querySelector('.target') as HTMLElement;
 * const siblingsAfter = getSiblingsAfter(targetElement);
 *
 * console.log('Siblings after the target element:', siblingsAfter);
 * ```
 */
export function getSiblingsAfter(element: HTMLElement): HTMLElement[] {
    const siblings: HTMLElement[] = [];
    let sibling = element.nextElementSibling;

    while (sibling) {
        siblings.push(sibling as HTMLElement);
        sibling = sibling.nextElementSibling;
    }

    return siblings;
}


/**
 * Retrieves all sibling elements that come before a specified element in the DOM.
 *
 * This function collects all siblings of the given element that appear before it in the DOM order.
 * It starts from the immediate next sibling and continues until there are no more siblings.
 *
 * @param element - The HTML element whose siblings before it are to be retrieved. Must be of type `HTMLElement`.
 * @returns An array of `HTMLElement` objects representing the siblings that come before the specified element.
 *
 */
export function getSiblingsBefore(element: HTMLElement): HTMLElement[] {
    const siblings: HTMLElement[] = [];
    let sibling = element.previousElementSibling;

    while (sibling) {
        siblings.push(sibling as HTMLElement);
        sibling = sibling.previousElementSibling;
    }

    return siblings;
}

/**
 * Counts the number of elements with a specific tag name starting from a base element,
 * including elements within shadow roots.
 *
 * @param baseElement - The base element from which to start counting. Must be of type `Element`.
 * @param tagName - The tag name of the elements to count. The value should be a string representing the tag name, case-insensitive (e.g., 'DIV', 'SPAN').
 * @returns The number of elements with the specified tag name found starting from the base element.
 */
export function countElementsWithTagName(baseElement: Element, tagName: string): number {

    let count = 0;

    // Function to recursively count elements with the specified tag name
    function countInElement(element: Element | ShadowRoot) {
        if (element instanceof ShadowRoot) {
            // Recursively count in the shadow root's host
            countInElement(element.host);
            // Count elements within the shadow root itself
            Array.from(element.children).forEach(child => countInElement(child as Element));
        } else if (element instanceof Element) {
            // Check the current element
            if (element.getAttribute('widget') === tagName) {
                count++;
            }
            // Recursively count in child elements
            Array.from(element.children).forEach(child => countInElement(child as Element));
        }
    }

    countInElement(baseElement);
    return count;
}


