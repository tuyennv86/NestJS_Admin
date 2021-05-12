import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/jwt/get-user.decorater';
import { CategoryType, IsPublic } from 'src/common/enum/Identifier.enum';
import { CategoryTypevalidationPipe } from 'src/common/pipes/category-type-validation.pipe';
import { IspublicValidationPipe } from 'src/common/pipes/ispublic-validation.pipe';
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

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Post()
    createCategory(@Body() createCategoryDto: CreateCategoryDto,
        @Body('public', IspublicValidationPipe) isPublic: IsPublic,
        @Body('typecode', CategoryTypevalidationPipe) typeCode: CategoryType,
        @GetUser() user: User): Promise<Category> {

        this.logger.verbose(`danh sách dto ${JSON.stringify(createCategoryDto)}`)
        return this.categoryService.createCategory(createCategoryDto, isPublic, typeCode, user);

    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Put('/:id')
    updateCategory(@Param('id', ParseIntPipe) id: number,
        @Body() createCategoryDto: CreateCategoryDto,
        @Body('public', IspublicValidationPipe) isPublic: IsPublic,
        @Body('typecode', CategoryTypevalidationPipe) typeCode: CategoryType,
        @GetUser() user: User): Promise<Category> {

        if (id === createCategoryDto.parentId) {
            throw new HttpException(`id ${id} bị trùng với cha parentId ${createCategoryDto.parentId}`, HttpStatus.EXPECTATION_FAILED);
        }
        //this.logger.verbose(`Update theo id ${id} với danh sách dto ${JSON.stringify(createCategoryDto)}`)
        return this.categoryService.updateCategory(id, createCategoryDto, isPublic, typeCode, user);
    }

    @ApiOperation({ description: 'Chỉ xóa được phần tử đó khi phần từ đó không có con' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Delete('/:id')
    deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.categoryService.deleteCategory(id);
    }
}
