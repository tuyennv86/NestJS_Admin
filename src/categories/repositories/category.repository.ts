import { HttpException, HttpStatus } from "@nestjs/common";
import { CategoryType, IsPublic } from "../../common/enum/Identifier.enum";
import { EntityRepository, TreeRepository } from "typeorm"
import { CreateCategoryDto } from "../dto/create-category.dto"
import { Category } from "../entities/category.entity"
import { User } from "src/auth/entities/user.entity";

@EntityRepository(Category)
export class CategoryRepository extends TreeRepository<Category> {

    async createCategory(createCategoryDto: CreateCategoryDto, isPublic: IsPublic, categoryType: CategoryType, user: User): Promise<Category> {
        const categoryParent = await this.findOne(createCategoryDto.parentId);
        const category = new Category();
        category.name = createCategoryDto.name;
        category.title = createCategoryDto.title;
        category.pageSize = createCategoryDto.pageSize;
        category.typeCode = categoryType;
        category.isPublished = isPublic;
        category.order = createCategoryDto.order;
        category.userIdCreate = user.id;
        category.createDate = createCategoryDto.createDate;
        if (categoryParent) {
            category.parent = categoryParent;
        }
        await category.save();
        return category;
    }

    async updateCategory(id: number, createCategoryDto: CreateCategoryDto, isPublic: IsPublic, categoryType: CategoryType, user: User): Promise<Category> {

        const category = await this.findOne(id);
        const categoryParent = await this.findOne(createCategoryDto.parentId);
        const categoryParentOld = await this.findOne(category.parentId);

        const parentIdNew = createCategoryDto.parentId;
        const parentIdOld = category.parentId;
        const listChildren = await this.findDescendants(category);
        const listParent = await this.findAncestors(categoryParent);
        const listParentOld = await this.findAncestors(categoryParentOld);

        category.name = createCategoryDto.name;
        category.title = createCategoryDto.title;
        category.pageSize = createCategoryDto.pageSize;
        category.typeCode = categoryType;
        category.isPublished = isPublic
        category.order = createCategoryDto.order;
        category.userIdCreate = user.id;
        category.createDate = createCategoryDto.createDate;
        if (categoryParent) {
            category.parent = categoryParent;
        } else {
            category.parent = null;
        }

        await category.save();
        if (!categoryParent) {// nếu cha la null chuyển về root
            // update toa bộ nó và con của nó bằng chính id của nó
            listChildren.forEach(item => {
                this.query(`update category_closure set id_ancestor = ${category.id} where id_ancestor = ${category.id} and id_descendant = ${item.id}`);
            });
        } else {
            listChildren.forEach(item => { // update toàn bộ id_ancestor của nó và con của nó về id cha mới
                this.query(`update category_closure set id_ancestor = ${parentIdNew} where id_ancestor = ${parentIdOld} and id_descendant = ${item.id}`);
            });

            // từ cha về con của 1 đối tượng  kiểm tra xem id_ancestor = parentNew and id_descendant = idItem có hay chưa nếu chưa thì thêm vào
            listParent.forEach(item => {
                this.query(`INSERT INTO category_closure(id_ancestor,id_descendant) select ${item.id},${id} 
                where not exists ( select id_ancestor FROM category_closure WHERE id_ancestor = ${item.id} and id_descendant = ${id})`);
            })

            //xoa parentOld
            listParentOld.forEach(item => {
                try {
                    this.query(`DELETE FROM category_closure where id_ancestor = ${item.id} and id_descendant = ${id}`);
                } catch (error) {
                    throw new HttpException(`Lỗi ${error}`, HttpStatus.NOT_ACCEPTABLE);
                }
            });

        }

        return category;
    }

    // async getChildrenByType(categoryType: CategoryType, parentCategory: Category): Promise<Category[]> {
    //     const children = await this.createDescendantsQueryBuilder("category", "categoryClosure", parentCategory)
    //         .andWhere("category.typeCode = " + categoryType)
    //         .getMany();
    //     // this.buildChildrenEntityTree()
    //     return children;
    // }

    async getChildrenNext(idParent: number): Promise<Category[]> {
        const parentCategory = await this.findOne(idParent);
        return await this.findDescendants(parentCategory);
    }

    async getChildrenNextTree(idParent: number): Promise<Category> {
        const parentCategory = await this.findOne(idParent);
        return await this.findDescendantsTree(parentCategory);
    }

    async getParent(id: number): Promise<Category[]> {
        const category = await this.findOne(id);
        return await this.findAncestors(category);
    }

    async getParentTree(id: number): Promise<Category> {
        const category = await this.findOne(id);
        return await this.findAncestorsTree(category);
    }

    async deleteCategory(id: number): Promise<void> {
        const category = await this.findOne(id);
        const categoryChild = await this.findDescendantsTree(category);
        if (categoryChild.children.length > 0) {
            throw new HttpException(`Bạn không thể xóa danh mục : ${category.name}! Hãy xóa hết các con trước.`, HttpStatus.NOT_ACCEPTABLE);
        }
        //xoa bang closure
        await this.query(`delete from category_closure where id_descendant = ${id}`);
        await this.delete(id);
    }

    // async getAllChildByTypeAndPublic(id: number, categoryType: CategoryType, isPublic: IsPublic): Promise<Category[]> {
    //     const category = await this.findOne(id);
    //     return await this.createDescendantsQueryBuilder("category", "categoryClosure", category)
    //         .andWhere("category.typeCode = :categoryType", { categoryType: categoryType })
    //         .andWhere("category.isPublished = :isPublished", { isPublished: isPublic })
    //         .getMany();
    // }
}