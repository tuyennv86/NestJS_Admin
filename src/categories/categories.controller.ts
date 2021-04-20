import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@ApiTags("Categories")
@Controller('categories')
export class CategoriesController {

    private logger = new Logger('CategoriesController')
    constructor(private categoryService: CategoriesService) { }

    @ApiOperation({ description: 'Lấy toàn bộ danh sách trả về tree' })
    @Get()
    getAllTrees(): Promise<Category[]> {
        return this.categoryService.getAllByTreeCategory();
    }

    @ApiOperation({ description: 'Lấy một phần tử với id = ${id}' })
    @Get('/:id')
    getCategoryById(@Param('id', ParseIntPipe) id: number): Promise<Category> {
        return this.categoryService.getByCategoryId(id);
    }

    @ApiOperation({ description: 'Lấy toàn bộ root' })
    @Patch('/allroots')
    getAllRoot(): Promise<Category[]> {
        return this.categoryService.getByRootCategory();
    }

    @ApiOperation({ description: 'Lấy danh sách nó và con của nó' })
    @Patch('/childers/:id')
    getChildrenNext(@Param('id', ParseIntPipe) id: number): Promise<Category[]> {
        return this.categoryService.getChildrenNext(id);
    }

    @ApiOperation({ description: 'Lấy cây nó và con của nó' })
    @Patch('/childertree/:id')
    getChildrenNextTree(@Param('id', ParseIntPipe) id: number): Promise<Category> {
        return this.categoryService.getChildrenNextTree(id);
    }

    @ApiOperation({ description: 'Lấy danh sách nó và cha của nó' })
    @Patch('/parents/:id')
    getParentNext(@Param('id', ParseIntPipe) id: number): Promise<Category[]> {
        return this.categoryService.getParent(id);
    }

    @ApiOperation({ description: 'Lấy về cây nó và cha của nó' })
    @Patch('/parenttree/:id')
    getParentNextTree(@Param('id', ParseIntPipe) id: number): Promise<Category> {
        return this.categoryService.getParentTree(id);
    }

    @Post()
    createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
        this.logger.verbose(`danh sách dto ${JSON.stringify(createCategoryDto)}`)
        return this.categoryService.createCategory(createCategoryDto);
    }

    @Put('/:id')
    updateCategory(@Param('id', ParseIntPipe) id: number, @Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
        if (id === createCategoryDto.parentId) {
            throw new HttpException(`id ${id} bị trùng với cha parentId ${createCategoryDto.parentId}`, HttpStatus.CONFLICT);
        }
        //this.logger.verbose(`Update theo id ${id} với danh sách dto ${JSON.stringify(createCategoryDto)}`)
        return this.categoryService.updateCategory(id, createCategoryDto);
    }

    @Delete('/:id')
    deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.categoryService.deleteCategory(id);
    }
}
