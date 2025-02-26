export class ConvertUtil {
  static buildCategoryTree(categoryMap: Map<string, any>) {
    const tree: any[] = [];
    categoryMap.forEach((category, _) => {
      const parentCategoryId =
        category.parentCategoryId || category.parentCategory?.toString();

      if (parentCategoryId) {
        const parentCategory = categoryMap.get(parentCategoryId);
        if (parentCategory) {
          parentCategory.subcategories.push(category);
        }
      } else {
        tree.push(category);
      }
    });

    return tree;
  }
}
