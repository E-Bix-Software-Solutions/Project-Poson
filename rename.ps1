$files = Get-ChildItem -Path "public/greetings" -Filter *.jpeg | Sort-Object Name
$i = 1
foreach ($file in $files) {
    $newName = "$i.jpeg"
    Write-Host "Renaming $($file.Name) to $newName"
    Rename-Item -Path $file.FullName -NewName $newName -Force
    $i++
}
