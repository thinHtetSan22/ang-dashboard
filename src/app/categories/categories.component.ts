import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';
// import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {

  categoryArray: Array <any> = [];
  formCategory: string | undefined;
  formStatus: string = 'Add';
  categoryId: string | undefined;

  constructor( private categoryService: CategoriesService ) { }

  ngOnInit(): void {
    this.categoryService.loadData().subscribe( val => {
      // console.log(val);
      this.categoryArray = val;
    })
  }

  onSubmit(formData: any){
    // console.log(formData.value);

    let categoryData: Category = {
      category: formData.value.category
    }

    if( this.formStatus == 'Add'){
      this.categoryService.saveData(categoryData);
      formData.reset();
    }
    else if(this.formStatus == 'Edit'){
      this.categoryService.updateData(this.categoryId, categoryData);
      formData.reset();
      // this.formStatus = 'Add';
    }

    // this.categoryService.saveData(categoryData);

    // formData.reset();


    // let subCategoryData = {
    //   subCategory: 'subCategory1'
    // }


    // console.log(categoryData);

    // this.afs.collection('categories').add(categoryData).then(docRef => {
    //   console.log(docRef);

    //   this.afs.doc(`categories/${docRef.id}`).collection('subcategories').add(subCategoryData)
    //   this.afs.collection('categories').doc(docRef.id).collection('subcategories').add(subCategoryData).then(docRef1 => {
    //     console.log(docRef1);

    //     this.afs.doc(`categories/${docRef.id}/subcategories/${docRef1.id}`).collection('subsubcategories').add(subCategoryData)
        

    //     this.afs.collection('categories').doc(docRef.id).collection('subcategories').doc(docRef.id).collection('subsubcategories').add(subCategoryData).then(docRef2 => {
    //       console.log('Second Level Subcategory Saved Successfully');
    //     })

    //   })
    // }).catch(err => {console.log(err) })
  }

  onEdit(category: any, id: any){
    // console.log(category);
    this.formCategory = category;
    this.formStatus = 'Edit';
    this.categoryId = id;
  }

  onDelete(id: any){
    this.categoryService.deleteData(id);
  }

}
