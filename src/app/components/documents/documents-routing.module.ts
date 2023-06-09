import { NgModule } from "@angular/core";
import { RouterModule , Routes } from "@angular/router";
import { DocumentosComponent } from "./documentos/documentos.component";
import { PlantillasComponent } from "./plantillas/plantillas.component";
import { LogosComponent } from "./logos/logos.component";
import { ManaulesGuiasComponent } from "./manaules-guias/manaules-guias.component";

const routes: Routes = [
    {
        path:'documentosFresmar',
        component: DocumentosComponent
    },
    {
        path:'plantillasFresmar',
        component: PlantillasComponent
    },
    {
        path:'logosFresmar',
        component: LogosComponent
    },
    {
        path:'manuales-Guias-Fresmar',
        component: ManaulesGuiasComponent
    }
];
@NgModule ({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class DocumentsRoutingModule {}
