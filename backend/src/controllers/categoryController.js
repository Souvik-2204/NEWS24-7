import { readJson, writeJson, logActivity } from '../utils/storage.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await readJson('categories.json', []);
    categories.sort((a, b) => (a.order || 99) - (b.order || 99));
    return res.json(categories);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve categories.', error: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, order } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ message: 'Category name and slug are required.' });
    }

    const categories = await readJson('categories.json', []);
    const existing = categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
    if (existing) {
      return res.status(409).json({ message: 'Category slug already exists.' });
    }

    const newCategory = {
      id: slug.toLowerCase(),
      name,
      slug: slug.toLowerCase(),
      description: description || '',
      order: order ? parseInt(order) : categories.length + 1
    };

    categories.push(newCategory);
    await writeJson('categories.json', categories);
    await logActivity('CATEGORY_CREATED', { name: newCategory.name }, req.user?.id, req.user?.role);

    return res.status(201).json({ message: 'Category created.', category: newCategory });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create category.', error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categories = await readJson('categories.json', []);
    const index = categories.findIndex((c) => c.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    categories[index] = { ...categories[index], ...req.body };
    await writeJson('categories.json', categories);
    return res.json({ message: 'Category updated.', category: categories[index] });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update category.', error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categories = await readJson('categories.json', []);
    const filtered = categories.filter((c) => c.id !== id);

    if (filtered.length === categories.length) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    await writeJson('categories.json', filtered);
    return res.json({ message: 'Category deleted.' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete category.', error: err.message });
  }
};
